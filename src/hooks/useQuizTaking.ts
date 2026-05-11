// src/hooks/useQuizTaking.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { startQuizApi, submitQuizApi } from '../constants/quizApi';
import type {
    QuizDetail, QuizQuestion, QuizResult,
    AnswerMap, FlagMap,
} from '../types/quizTaking.types';

export function useQuizTaking(quizId: string) {
    const [quiz, setQuiz]             = useState<QuizDetail | null>(null);
    const [attemptId, setAttemptId]   = useState<string>('');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers]       = useState<AnswerMap>({});
    const [flags, setFlags]           = useState<FlagMap>({});
    const [timeLeft, setTimeLeft]     = useState(0);
    const [loading, setLoading]       = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult]         = useState<QuizResult | null>(null);

    // ── Gọi POST /quiz/{id}/start ────────────────────────────────────────────
    useEffect(() => {
        if (!quizId) return;

        const startQuiz = async () => {
            setLoading(true);
            try {
                const res = await startQuizApi(quizId);

                setAttemptId(res.attemptId);
                setQuiz(res.quiz);

                // Dùng timeRemainingSeconds từ BE (nếu có) để resume;
                // fallback: timer * 60 từ quiz data
                const seconds = res.timeRemainingSeconds > 0
                    ? res.timeRemainingSeconds
                    : (res.quiz.timer ?? 10) * 60;
                setTimeLeft(seconds);

            } catch (error: any) {
                const msg = error?.response?.data?.message ?? 'Không thể tải bài quiz. Vui lòng thử lại.';
                Alert.alert('Lỗi', msg, [
                    { text: 'OK' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        startQuiz();
    }, [quizId]);

    // ── Timer đếm ngược ──────────────────────────────────────────────────────
    useEffect(() => {
        if (loading || showResult || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, showResult, timeLeft]);

    const handleTimeUp = useCallback(() => {
        Alert.alert(
            'Hết giờ!',
            'Thời gian làm bài đã kết thúc. Bài sẽ được nộp tự động.',
            [{ text: 'OK', onPress: () => submitQuiz(true) }],
        );
    }, [answers]);

    const formatTime = (s: number): string => {
        const min = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    // ── Actions ──────────────────────────────────────────────────────────────
    const selectAnswer = (questionId: string, answerId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const toggleFlag = (questionId: string) => {
        setFlags(prev => ({ ...prev, [questionId]: !prev[questionId] }));
    };

    const goNext = () => {
        if (quiz && currentIdx < quiz.questions.length - 1)
            setCurrentIdx(i => i + 1);
    };

    const goPrev = () => {
        if (currentIdx > 0) setCurrentIdx(i => i - 1);
    };

    // ── Nộp bài — gọi POST /quiz/{id}/submit ─────────────────────────────────
    const submitQuiz = useCallback(async (isAuto = false) => {
        if (submitting || !quiz) return;
        setSubmitting(true);

        // Map AnswerMap { questionId: answerId } → List<UserAnswerRequest>
        const answersPayload = Object.entries(answers).map(
            ([questionId, selectedAnswerId]) => ({ questionId, selectedAnswerId }),
        );

        try {
            const res = await submitQuizApi(quizId, {
                attemptId,
                answers: answersPayload,
            });

            setResult(res);
            setShowResult(true);

        } catch (error: any) {
            const msg = error?.response?.data?.message ?? 'Nộp bài thất bại. Vui lòng thử lại.';
            Alert.alert('Lỗi nộp bài', msg);
        } finally {
            setSubmitting(false);
        }
    }, [submitting, quiz, answers, attemptId, quizId]);

    const handleSubmit = () => {
        const unanswered = (quiz?.questions.length ?? 0) - Object.keys(answers).length;
        const unansweredText = unanswered > 0
            ? `\n⚠️ Còn ${unanswered} câu chưa trả lời.`
            : '';

        Alert.alert(
            'Nộp bài thi?',
            `Hãy kiểm tra kỹ trước khi nộp.${unansweredText}`,
            [
                { text: 'Kiểm tra lại', style: 'cancel' },
                { text: 'Nộp bài', style: 'default', onPress: () => submitQuiz(false) },
            ],
        );
    };

    // ── Làm lại — gọi lại /start để có attemptId mới ────────────────────────
    const handleRetake = () => {
        Alert.alert(
            'Làm lại bài thi?',
            'Tiến trình hiện tại sẽ bị hủy.',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text:  'Làm lại ngay',
                    style: 'destructive',
                    onPress: async () => {
                        // Reset UI ngay
                        setAnswers({});
                        setFlags({});
                        setCurrentIdx(0);
                        setShowResult(false);
                        setResult(null);
                        setLoading(true);

                        // Gọi /start lại để lấy attemptId mới
                        try {
                            const res = await startQuizApi(quizId);
                            setAttemptId(res.attemptId);
                            setQuiz(res.quiz);
                            const seconds = res.timeRemainingSeconds > 0
                                ? res.timeRemainingSeconds
                                : (res.quiz.timer ?? 10) * 60;
                            setTimeLeft(seconds);
                        } catch (error: any) {
                            const msg = error?.response?.data?.message ?? 'Không thể tải lại bài quiz.';
                            Alert.alert('Lỗi', msg);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
        );
    };

    // ── Derived state ────────────────────────────────────────────────────────
    const questions      = quiz?.questions ?? [];
    const answeredCount  = Object.keys(answers).length;
    const progressPercent = questions.length > 0
        ? Math.round((answeredCount / questions.length) * 100)
        : 0;

    return {
        quiz, attemptId, questions,
        currentIdx, setCurrentIdx,
        answers, flags,
        timeLeft, formatTime,
        loading, submitting,
        showResult, result,
        progressPercent, answeredCount,
        selectAnswer, toggleFlag,
        goNext, goPrev,
        handleSubmit, handleRetake,
    };
}
