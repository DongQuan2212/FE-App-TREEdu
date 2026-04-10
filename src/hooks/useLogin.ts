import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';
import { useAuth } from '../context/AuthContext';
import type { LoginFormErrors, LoginResponse } from '../types/auth';

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

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const loginRes = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            const loginData: LoginResponse = await loginRes.json();

            if (!loginRes.ok || loginData.statusCode !== 200) {
                Alert.alert(
                    'Đăng nhập thất bại',
                    loginData?.message ?? 'Email hoặc mật khẩu không đúng.'
                );
                return;
            }

            // login() sẽ: saveToken + gọi current-user + setUser global
            await login(loginData.data);

            router.replace('/tabs/home' as any);

        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPass,
        loading, errors,
        clearError, handleLogin,
    };
}
