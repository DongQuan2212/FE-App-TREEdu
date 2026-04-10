import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
    QuizDetail, QuizQuestion, QuizResult,
    AnswerMap, FlagMap,
} from '../types/quizTaking.types';

// ── Mock data — thay bằng API sau ─────────────────────────
const MOCK_QUIZ: QuizDetail = {
    title: 'Các Loại Kiểm Thử Phần Mềm',
    questions: [
        {
            questionId: 'q1',
            content: 'Kiểm thử nào tập trung vào việc xác minh rằng các thành phần hoặc mô-đun riêng lẻ hoạt động chính xác?',
            options: [
                { answerId: 'a1', content: 'Kiểm thử tích hợp (Integration Test)' },
                { answerId: 'a2', content: 'Kiểm thử hệ thống (System Test)' },
                { answerId: 'a3', content: 'Kiểm thử đơn vị (Unit Test)' },
                { answerId: 'a4', content: 'Kiểm thử chấp nhận (Acceptance Test)' },
            ],
        },
        {
            questionId: 'q2',
            content: 'Phương pháp kiểm thử nào kiểm tra toàn bộ hệ thống như một tổng thể?',
            options: [
                { answerId: 'b1', content: 'Unit Testing' },
                { answerId: 'b2', content: 'System Testing' },
                { answerId: 'b3', content: 'Regression Testing' },
                { answerId: 'b4', content: 'Smoke Testing' },
            ],
        },
        {
            questionId: 'q3',
            content: 'Black-box testing tập trung vào điều gì?',
            options: [
                { answerId: 'c1', content: 'Cấu trúc bên trong của code' },
                { answerId: 'c2', content: 'Logic thuật toán' },
                { answerId: 'c3', content: 'Đầu vào và đầu ra mà không biết cấu trúc bên trong' },
                { answerId: 'c4', content: 'Hiệu năng hệ thống' },
            ],
        },
    ],
};

export function useQuizTaking(quizId: string) {
    const [quiz, setQuiz]               = useState<QuizDetail | null>(null);
    const [attemptId, setAttemptId]     = useState<string>('46898d');
    const [currentIdx, setCurrentIdx]   = useState(0);
    const [answers, setAnswers]         = useState<AnswerMap>({});
    const [flags, setFlags]             = useState<FlagMap>({});
    const [timeLeft, setTimeLeft]       = useState(0);
    const [loading, setLoading]         = useState(true);
    const [submitting, setSubmitting]   = useState(false);
    const [showResult, setShowResult]   = useState(false);
    const [result, setResult]           = useState<QuizResult | null>(null);

    // ── Load quiz (thay bằng API) ──────────────────────────
    useEffect(() => {
        setTimeout(() => {
            setQuiz(MOCK_QUIZ);
            setTimeLeft(10 * 60); // 10 phút
            setLoading(false);
        }, 800);
    }, [quizId]);

    // ── Timer ──────────────────────────────────────────────
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
        Alert.alert('Hết giờ!', 'Thời gian làm bài đã kết thúc. Bài sẽ được nộp tự động.', [
            { text: 'OK', onPress: () => submitQuiz(true) },
        ]);
    }, [answers]);

    const formatTime = (s: number) => {
        const min = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

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

    const submitQuiz = useCallback((isAuto = false) => {
        if (submitting) return;
        setSubmitting(true);

        // Mock result — thay bằng API
        setTimeout(() => {
            setResult({
                score: 2,
                totalQuestions: quiz?.questions.length ?? 0,
                percentage: 67,
                results: (quiz?.questions ?? []).map((q, i) => ({
                    content: q.content,
                    correct: i % 2 === 0,
                    selectedAnswer: answers[q.questionId]
                        ? q.options.find(o => o.answerId === answers[q.questionId])?.content ?? 'Không trả lời'
                        : 'Không trả lời',
                    correctAnswer: q.options[2]?.content ?? '',
                    explanation: 'Đây là giải thích cho câu hỏi này.',
                })),
            });
            setSubmitting(false);
            setShowResult(true);
        }, 1000);
    }, [submitting, quiz, answers]);

    const handleSubmit = () => {
        Alert.alert(
            'Nộp bài thi?',
            'Hãy kiểm tra kỹ các câu hỏi đã đánh dấu trước khi nộp.',
            [
                { text: 'Kiểm tra lại', style: 'cancel' },
                { text: 'Nộp bài', style: 'default', onPress: () => submitQuiz(false) },
            ]
        );
    };

    const handleRetake = () => {
        Alert.alert(
            'Làm lại bài thi?',
            'Tiến trình hiện tại sẽ bị hủy.',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Làm lại ngay',
                    style: 'destructive',
                    onPress: () => {
                        setAnswers({});
                        setFlags({});
                        setCurrentIdx(0);
                        setShowResult(false);
                        setResult(null);
                        setTimeLeft(10 * 60);
                    },
                },
            ]
        );
    };

    const questions = quiz?.questions ?? [];
    const answeredCount = Object.keys(answers).length;
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
