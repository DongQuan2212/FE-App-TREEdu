import Constants from 'expo-constants';

const getBaseUrl = () => {
    const host = Constants.expoConfig?.hostUri?.split(':')[0];
    if (host) return `http://${host}:3001/api`;
    return 'http://localhost:3001/api';
};

export const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
    register:      `${API_BASE_URL}/users/newMember`,
    login:         `${API_BASE_URL}/auth/login`,
    currentUser:   `${API_BASE_URL}/auth/current-user`,
    myProfile:      `${API_BASE_URL}/users/me`,
    quizList:      `${API_BASE_URL}/quiz`,
    flashcardList: `${API_BASE_URL}/flashcards`,
    verifyOtp:     `${API_BASE_URL}/auth/verify-otp`,
    resendOtp:     `${API_BASE_URL}/auth/resend-otp`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword:  `${API_BASE_URL}/auth/reset-password`,
};
