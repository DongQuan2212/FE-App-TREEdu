import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { getToken, saveToken, clearAuth } from '../utils/storage';
import type { CurrentUser } from '../types/auth';

interface AuthContextType {
    user:    CurrentUser | null;
    token:   string | null;
    loading: boolean;
    login:   (token: string) => Promise<void>;
    logout:  () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user,    setUser]    = useState<CurrentUser | null>(null);
    const [token,   setToken]   = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // ── Gọi current-user với token cụ thể ───────────────
    const fetchUser = useCallback(async (jwt: string) => {
        try {
            const res = await fetch(API_ENDPOINTS.currentUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.statusCode === 200) setUser(data.data);
            } else if (res.status === 401 || res.status === 403) {
                // Token hết hạn → xóa
                await clearAuth();
                setToken(null);
                setUser(null);
            }
        } catch {
            // Lỗi mạng → giữ token, không logout
        }
    }, []);

    // ── Khởi động: đọc token → nếu có thì fetch user ────
    useEffect(() => {
        const init = async () => {
            try {
                const stored = await getToken();
                if (stored) {
                    setToken(stored);
                    await fetchUser(stored); // chỉ gọi khi CÓ token
                }
                // Nếu không có token → bỏ qua, không gọi API
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [fetchUser]);

    // ── Gọi sau khi login thành công ────────────────────
    const login = async (jwt: string) => {
        await saveToken(jwt);
        setToken(jwt);
        await fetchUser(jwt);
    };

    // ── Logout ───────────────────────────────────────────
    const logout = async () => {
        await clearAuth();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
