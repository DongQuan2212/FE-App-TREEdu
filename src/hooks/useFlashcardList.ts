import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { getToken } from '../utils/storage';
import type { Flashcard, FlashcardListResponse } from '../types/flashcard';

export function useFlashcardList() {
    const [flashcards,  setFlashcards]  = useState<Flashcard[]>([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState<string | null>(null);
    const [refreshing,  setRefreshing]  = useState(false);

    const fetchFlashcards = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError(null);

        try {
            const token = await getToken();

            const res = await fetch(API_ENDPOINTS.flashcardList, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const data: FlashcardListResponse = await res.json();

            if (res.ok && data.success) {
                setFlashcards(data.data);
            } else {
                setError(data.message ?? 'Không thể tải danh sách flashcard.');
            }
        } catch {
            setError('Không thể kết nối. Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchFlashcards();
    }, [fetchFlashcards]);

    const refresh = () => fetchFlashcards(true);

    return { flashcards, loading, error, refreshing, refresh };
}
