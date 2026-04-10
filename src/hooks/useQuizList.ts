import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { getToken } from '../utils/storage';
import type { Quiz, QuizListResponse } from '../types/quiz';

export function useQuizList() {
    const [quizzes,  setQuizzes]  = useState<Quiz[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchQuizzes = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError(null);

        try {
            const token = await getToken();

            const res = await fetch(API_ENDPOINTS.quizList, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const data: QuizListResponse = await res.json();

            if (res.ok && data.success) {
                setQuizzes(data.data.content);
            } else {
                setError(data.message ?? 'Không thể tải danh sách quiz.');
            }
        } catch {
            setError('Không thể kết nối. Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const refresh = () => fetchQuizzes(true);

    return { quizzes, loading, error, refreshing, refresh };
}
