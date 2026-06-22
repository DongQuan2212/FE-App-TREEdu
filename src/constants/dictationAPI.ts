import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './api';
import type { ApiResponse } from '../types/auth'; // Type có sẵn của bạn
import type {
    Dictation,
    DictationDetail,
    CheckAnswerPayload,
    CheckAnswerResult
} from '../types/dictation.types';

// ── Lấy danh sách bài nghe ────────────────────────────────────────
export const getAllDictationApi = async (): Promise<Dictation[]> => {
    const { data } = await axiosClient.get<ApiResponse<Dictation[]>>(
        API_ENDPOINTS.dictationList,
    );
    return data.data;
};

// ── Lấy chi tiết bài nghe ─────────────────────────────────────────
export const getDictationDetailApi = async (id: string): Promise<DictationDetail> => {
    const { data } = await axiosClient.get<ApiResponse<DictationDetail>>(
        API_ENDPOINTS.dictationDetail(id),
    );
    return data.data;
};

// ── Kiểm tra đáp án (Nộp bài) ─────────────────────────────────────
export const checkDictationAnswerApi = async (
    id: string,
    payload: CheckAnswerPayload
): Promise<CheckAnswerResult> => {
    const { data } = await axiosClient.post<ApiResponse<CheckAnswerResult>>(
        API_ENDPOINTS.dictationCheck(id),
        payload,
    );
    return data.data;
};
