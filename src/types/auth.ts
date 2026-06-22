// src/types/auth.ts

// ── Login ────────────────────────────────────────────────────────────────────
export interface LoginPayload {
    email:    string;
    password: string;
}

export interface LoginResponse {
    message:    string;
    statusCode: number;
    data:       string; // JWT token string
    timestamp:  string;
}

export interface LoginFormErrors {
    email?:    string;
    password?: string;
}

// ── Register ─────────────────────────────────────────────────────────────────
export interface RegisterPayload {
    userType: 'MEMBER';
    email:    string;
    fullName: string;
    password: string;
}

export interface RegisterResponse {
    message:    string;
    statusCode: number;
    timestamp:  string;
    data: {
        id:         string;
        userType:   string | null;
        fullName:   string;
        email:      string;
        password:   string;
        createdOn:  string | null;
        modifiedOn: string | null;
        active:     boolean;
    };
}

export interface RegisterFormErrors {
    fullName?: string;
    email?: string;
    password?: string;
    rePassword?: string;
    phoneNumber?: string;
    birthYear?: string;
    general?: string;
}

// ── Current User ─────────────────────────────────────────────────────────────
export type UserRole = 'ROLE_ADMIN' | 'ROLE_MEMBER' | 'ROLE_SUPPORTER';

export interface CurrentUser {
    id:     string;
    email:  string;
    fullname:   string;
    role:   UserRole;
    status: string | null;
}

export interface CurrentUserResponse {
    message:    string;
    statusCode: number;
    data:       CurrentUser;
    timestamp:  string;
}

export interface UserProfile {
    id:                    string;
    fullName:              string;
    email:                 string;
    streakCount:           number;
    longestStreak:         number;
    xp:                    number;
    level:                 number;
    totalQuizCompleted:    number;
    totalFlashcardLearned: number;
    lastStudyDate:         string | null;
}

export interface ApiResponse<T = unknown> {
    message:    string;
    statusCode: number;
    data:       T;
    timestamp:  string;
}
