export const API_BASE_URL = 'http://192.168.88.173:3001/api';

export const API_ENDPOINTS = {
    // Auth
    register:    `${API_BASE_URL}/users/newMember`,
    login:       `${API_BASE_URL}/auth/login`,
    currentUser: `${API_BASE_URL}/auth/current-user`,

    // Quiz
    quizList:    `${API_BASE_URL}/quiz`,
    flashcardList: `${API_BASE_URL}/flashcards`,
};

