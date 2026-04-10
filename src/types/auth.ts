// ── Register ────────────────────────────────────────────
export interface RegisterPayload {
    userType: 'MEMBER';
    email: string;
    fullName: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    statusCode: number;
    timestamp: string;
    data: {
        id: string;
        userType: string | null;
        fullName: string;
        email: string;
        password: string;
        createdOn: string | null;
        modifiedOn: string | null;
        active: boolean;
    };
}

export interface RegisterFormErrors {
    fullName?: string;
    email?: string;
    password?: string;
}

// ── Login ────────────────────────────────────────────────
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    statusCode: number;
    data: string; // JWT token
    timestamp: string;
}

export interface LoginFormErrors {
    email?: string;
    password?: string;
}

// ── Current User ─────────────────────────────────────────
export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string | null;
}

export interface CurrentUserResponse {
    message: string;
    statusCode: number;
    data: CurrentUser;
    timestamp: string;
}
