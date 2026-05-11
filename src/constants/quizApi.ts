// src/constants/quizApi.ts
import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants/api';
import type {
    StartQuizResponse,
    SubmitQuizRequest,
    QuizAttemptResponse,
} from '../types/quizTaking.types';
import type { ApiResponse } from '../types/auth';

/**
 * Bắt đầu làm bài quiz.
 * BE tạo attempt, trả về attemptId + quiz data + thời gian còn lại.
 * Token tự động gắn bởi axiosClient interceptor.
 */
export const startQuizApi = async (quizId: string): Promise<StartQuizResponse> => {
    const { data } = await axiosClient.post<ApiResponse<StartQuizResponse>>(
        `${API_ENDPOINTS.quizList}/${quizId}/start`,
    );
    return data.data;
};

/**
 * Nộp bài quiz.
 * Gửi attemptId + danh sách { questionId, answerId } user đã chọn.
 */
export const submitQuizApi = async (
    quizId:  string,
    payload: SubmitQuizRequest,
): Promise<QuizAttemptResponse> => {
    const { data } = await axiosClient.post<ApiResponse<QuizAttemptResponse>>(
        `${API_ENDPOINTS.quizList}/${quizId}/submit`,
        payload,
    );
    return data.data;
};
