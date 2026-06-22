import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './api';
import type { Flashcard, FlashcardListResponse } from '../types/flashcard';
import type { FlashcardDetail, FlashcardWord, WordFormState } from '../types/flashcardDetail.types';
import type { ApiResponse } from '../types/auth';

// ── Flashcard list ────────────────────────────────────────
export const getAllFlashcardsApi = async (): Promise<Flashcard[]> => {
    const { data } = await axiosClient.get<FlashcardListResponse>(
        API_ENDPOINTS.flashcardList,
    );
    return data.data;
};

// ── Flashcard detail (có words) ───────────────────────────
export const getFlashcardDetailApi = async (id: string): Promise<FlashcardDetail> => {
    const { data } = await axiosClient.get<ApiResponse<FlashcardDetail>>(
        `${API_ENDPOINTS.flashcardList}/${id}/details`,
    );
    return data.data;
};

// ── Create flashcard ──────────────────────────────────────
export const createFlashcardApi = async (payload: {
    title:       string;
    description: string;
    topic:       string;
    level:       number;
    visibility:  'PUBLIC' | 'PRIVATE';
}): Promise<Flashcard> => {
    const { data } = await axiosClient.post<ApiResponse<Flashcard>>(
        API_ENDPOINTS.flashcardList,
        payload,
    );
    return data.data;
};

// ── Word CRUD ─────────────────────────────────────────────
export const addWordApi = async (
    flashcardId: string,
    payload: WordFormState,
): Promise<FlashcardWord> => {
    const { data } = await axiosClient.post<ApiResponse<FlashcardWord>>(
        `${API_ENDPOINTS.flashcardList}/${flashcardId}/words`,
        payload,
    );
    return data.data;
};

export const updateWordApi = async (
    flashcardId: string,
    wordId:      string,
    payload:     WordFormState,
): Promise<FlashcardWord> => {
    const { data } = await axiosClient.put<ApiResponse<FlashcardWord>>(
        `${API_ENDPOINTS.flashcardList}/${flashcardId}/words/${wordId}`,
        payload,
    );
    return data.data;
};

export const deleteWordApi = async (
    flashcardId: string,
    wordId:      string,
): Promise<void> => {
    await axiosClient.delete(
        `${API_ENDPOINTS.flashcardList}/${flashcardId}/words/${wordId}`,
    );
};

// ── Learn ─────────────────────────────────────────────────
export const startLearnApi = async (flashcardId: string) => {
    const { data } = await axiosClient.post<ApiResponse<any>>(
        `${API_ENDPOINTS.flashcardList}/learn/${flashcardId}/start`,
    );
    return data.data;
};

export const markWordViewedApi = async (
    flashcardId: string,
    wordId:      string,
) => {
    const { data } = await axiosClient.put<ApiResponse<any>>(
        `${API_ENDPOINTS.flashcardList}/learn/${flashcardId}/mark-viewed`,
        { wordId },
    );
    return data.data;
};

export const resetLearnApi = async (flashcardId: string) => {
    const { data } = await axiosClient.post<ApiResponse<any>>(
        `${API_ENDPOINTS.flashcardList}/learn/${flashcardId}/reset`,
    );
    return data.data;
};

// ── Report ────────────────────────────────────────────────
export const reportFlashcardApi = async (
    id:     string,
    reason: string,
): Promise<void> => {
    await axiosClient.post(
        `${API_ENDPOINTS.flashcardList}/${id}/report`,
        { reason },
    );
};
