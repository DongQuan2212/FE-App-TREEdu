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
    leaderboardWeekly: `${API_BASE_URL}/leaderboard/weekly-xp`,
    leaderboardStreak: `${API_BASE_URL}/leaderboard/streak`,
    leaderboardTotal:  `${API_BASE_URL}/leaderboard/total-xp`,
    myTree: `${API_BASE_URL}/tree/my-tree`,
    waterTree: `${API_BASE_URL}/tree/water`,
    treeHistory: `${API_BASE_URL}/tree/history`,
    flashcardReport: (id: string) => `${API_BASE_URL}/flashcards/${id}/report`,

    dictationList: `${API_BASE_URL}/dictation`,
    dictationDetail: (id: string) => `${API_BASE_URL}/dictation/${id}`,
    dictationCheck: (id: string) => `${API_BASE_URL}/dictation/${id}/check`,
};
