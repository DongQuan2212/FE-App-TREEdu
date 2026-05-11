// src/context/AuthContext.tsx
//
// AuthContext chỉ lưu CurrentUser từ POST /auth/current-user.
// Mục đích: xác định identity + role cho toàn app.
//
// Các thông tin gamification (XP, streak...) lấy riêng qua
// getMyProfileApi() tại HomeScreen — KHÔNG lưu vào đây.
// ─────────────────────────────────────────────────────────────────────────────
import React, {
    createContext, useCallback, useContext,
    useEffect, useMemo, useState,
} from 'react';
import { saveToken, getToken, clearAuth } from '../utils/storage';
import { getCurrentUserApi }             from '../constants/authApi';
import { setAuthErrorCallback }          from '../constants/axiosClient';
import type { CurrentUser }              from '../types/auth';

interface AuthContextType {
    user:        CurrentUser | null;   // từ /auth/current-user
    token:       string | null;
    loading:     boolean;
    isLoggedIn:  boolean;
    login:       (jwt: string) => Promise<void>;
    logout:      () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user,    setUser]    = useState<CurrentUser | null>(null);
    const [token,   setToken]   = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        await clearAuth();
        setToken(null);
        setUser(null);
    }, []);

    // Fetch identity/role từ /auth/current-user
    const fetchUser = useCallback(async (manualToken?: string): Promise<void> => {
        try {
            const res = await getCurrentUserApi(manualToken);
            if (res.statusCode === 200 && res.data) {
                setUser(res.data);
            }
        } catch (error: any) {
            const status = error?.response?.status;
            if (status === 401 || status === 403) logout();
        }
    }, [logout]);

    useEffect(() => { setAuthErrorCallback(logout); }, [logout]);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const stored = await getToken();
                if (stored) {
                    setToken(stored);
                    await fetchUser(stored);
                }
            } finally {
                setLoading(false);
            }
        };
        bootstrap();
    }, [fetchUser]);

    const login = useCallback(async (jwt: string) => {
        setToken(jwt);
        await saveToken(jwt);
        await fetchUser(jwt);
    }, [fetchUser]);

    const refreshUser = useCallback(async () => { await fetchUser(); }, [fetchUser]);

    const value = useMemo(() => ({
        user, token, loading,
        isLoggedIn: !!user && !!token,
        login, logout, refreshUser,
    }), [user, token, loading, login, logout, refreshUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
