// src/hooks/useLogin.ts
import { useState }   from 'react';
import { Alert }      from 'react-native';
import { useRouter }  from 'expo-router';

import { loginApi }             from '../constants/authApi';
import { useAuth }              from '../context/AuthContext';
import type { LoginFormErrors } from '../types/auth';

export function useLogin() {
    const router    = useRouter();
    const { login } = useAuth();

    const [email,        setEmail]    = useState('');
    const [password,     setPassword] = useState('');
    const [showPassword, setShowPass] = useState(false);
    const [loading,      setLoading]  = useState(false);
    const [errors,       setErrors]   = useState<LoginFormErrors>({});

    const clearError = (field: keyof LoginFormErrors) =>
        setErrors((prev) => ({ ...prev, [field]: undefined }));

    // ── Validate ─────────────────────────────────────────────────────────────
    const validate = (): boolean => {
        const newErrors: LoginFormErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Handle login ──────────────────────────────────────────────────────────
    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await loginApi({
                email:    email.trim().toLowerCase(),
                password,
            });

            if (res.statusCode !== 200 || !res.data) {
                Alert.alert(
                    'Đăng nhập thất bại',
                    res.message ?? 'Email hoặc mật khẩu không đúng.',
                );
                return;
            }

            // Lưu token + fetch user → cập nhật AuthContext
            await login(res.data);

            // Dùng replace để không thể back về màn login
            router.replace('/tabs/home' as any);

        } catch (error: any) {
            const backendMsg = error?.response?.data?.message;
            Alert.alert(
                'Đăng nhập thất bại',
                backendMsg ?? 'Vui lòng kiểm tra kết nối mạng.',
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        email,        setEmail,
        password,     setPassword,
        showPassword, setShowPass,
        loading,      errors,
        clearError,   handleLogin,
    };
}
