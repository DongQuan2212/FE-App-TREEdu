// src/api/authApi.ts
import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants/api';
import type {
    LoginPayload,
    LoginResponse,
    CurrentUserResponse,
    UserProfile,
    ApiResponse,
} from '../types/auth';

/**
 * POST /auth/login
 * Trả về JWT token trong data.
 */
export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await axiosClient.post<LoginResponse>(
        API_ENDPOINTS.login,
        payload,
    );
    return data;
};

/**
 * POST /auth/current-user
 * Lấy identity + role. Dùng cho AuthContext bootstrap.
 * BE yêu cầu POST với body {}.
 */
export const getCurrentUserApi = async (token?: string): Promise<CurrentUserResponse> => {
    const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
    const { data } = await axiosClient.post<CurrentUserResponse>(
        API_ENDPOINTS.currentUser,
        {},
        config,
    );
    return data;
};

export const getMyProfileApi = async (): Promise<UserProfile> => {
    const { data } = await axiosClient.get<UserProfile>(
        API_ENDPOINTS.myProfile,
    );

    return data;
};
