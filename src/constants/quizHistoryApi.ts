// src/constants/quizHistoryApi.ts
// Thêm vào quizApi.ts hoặc import riêng — tuỳ cấu trúc project bạn

import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants/api';
import type { ApiResponse } from '../types/auth';
import type { QuizAttemptSummary } from '../types/quizHistory.types';

/**
 * GET /quiz/my-attempts
 * Lấy toàn bộ lịch sử làm bài của user hiện tại
 */
export const getMyAttemptsApi = async (): Promise<QuizAttemptSummary[]> => {
    const { data } = await axiosClient.get<ApiResponse<QuizAttemptSummary[]>>(
        `${API_ENDPOINTS.quizList}/my-attempts`,
    );
    return data.data;
};

/**
 * GET /quiz/{quizId}/my-attempts
 * Lấy lịch sử làm bài của user cho 1 quiz cụ thể
 */
export const getMyAttemptsByQuizApi = async (quizId: string): Promise<QuizAttemptSummary[]> => {
    const { data } = await axiosClient.get<ApiResponse<QuizAttemptSummary[]>>(
        `${API_ENDPOINTS.quizList}/${quizId}/my-attempts`,
    );
    return data.data;
};

/**
 * GET /quiz/attempts/{attemptId}
 * Xem chi tiết 1 lần làm bài (có đầy đủ results[])
 */
export const getAttemptDetailApi = async (attemptId: string): Promise<QuizAttemptSummary> => {
    const { data } = await axiosClient.get<ApiResponse<QuizAttemptSummary>>(
        `${API_ENDPOINTS.quizList}/attempts/${attemptId}`,
    );
    return data.data;
};
