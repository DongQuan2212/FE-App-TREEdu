// src/api/pronunciationApi.ts
import axiosClient from './axiosClient';
import type { ApiResponse } from '../types/auth';
import type { TopicResponse, PronunciationCheckResponse } from '../types/pronunciation.types';

const BASE = '/pronunciation-check';

/**
 * GET /api/pronunciation-check/topics
 * Lấy danh sách tất cả topic phát âm.
 */
export const getTopicsApi = async (): Promise<TopicResponse[]> => {
    const { data } = await axiosClient.get<ApiResponse<TopicResponse[]>>(`${BASE}/topics`);
    return data.data;
};

/**
 * GET /api/pronunciation-check/random-sentence?topic=xxx
 * Lấy câu ngẫu nhiên của topic.
 */
export const getRandomSentenceApi = async (topic: string): Promise<string> => {
    const { data } = await axiosClient.get<ApiResponse<string>>(`${BASE}/random-sentence`, {
        params: { topic },
    });
    return data.data;
};

/**
 * POST /api/pronunciation-check
 * Gửi audio + expectedText để AI chấm phát âm.
 * Dùng FormData vì có file audio.
 */
export const checkPronunciationApi = async (
    audioBlob: Blob,
    expectedText: string,
): Promise<PronunciationCheckResponse> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.m4a');
    formData.append('expectedText', expectedText);

    const { data } = await axiosClient.post<ApiResponse<PronunciationCheckResponse>>(
        BASE,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60_000,   // AI cần thời gian xử lý
        },
    );
    return data.data;
};
