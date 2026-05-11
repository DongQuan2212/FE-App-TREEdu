// src/hooks/useQuizHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
    getMyAttemptsApi,
    getMyAttemptsByQuizApi,
    getAttemptDetailApi,
} from '../constants/quizHistoryApi';
import type { QuizAttemptSummary } from '../types/quizHistory.types';

// ── Hook: danh sách toàn bộ lịch sử ─────────────────────────────────────────
export function useMyAttempts() {
    const [attempts, setAttempts] = useState<QuizAttemptSummary[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyAttemptsApi();
            setAttempts(data);
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? 'Không tải được lịch sử làm bài.';
            setError(msg);
            Alert.alert('Lỗi', msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, []);

    return { attempts, loading, error, refresh: fetch };
}

// ── Hook: lịch sử theo 1 quiz cụ thể ────────────────────────────────────────
export function useAttemptsByQuiz(quizId: string) {
    const [attempts, setAttempts] = useState<QuizAttemptSummary[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);

    const fetch = useCallback(async () => {
        if (!quizId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getMyAttemptsByQuizApi(quizId);
            setAttempts(data);
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? 'Không tải được lịch sử.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => { fetch(); }, [quizId]);

    return { attempts, loading, error, refresh: fetch };
}

// ── Hook: chi tiết 1 lần làm bài ────────────────────────────────────────────
export function useAttemptDetail(attemptId: string) {
    const [attempt, setAttempt] = useState<QuizAttemptSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        if (!attemptId) return;

        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAttemptDetailApi(attemptId);
                setAttempt(data);
            } catch (e: any) {
                const msg = e?.response?.data?.message ?? 'Không tải được chi tiết bài làm.';
                setError(msg);
                Alert.alert('Lỗi', msg);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [attemptId]);

    return { attempt, loading, error };
}
