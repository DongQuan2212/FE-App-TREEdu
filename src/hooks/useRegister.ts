import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';
import type { RegisterFormErrors } from '../types/auth';

export function useRegister() {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<RegisterFormErrors>({});

    // ── Xoá lỗi của 1 field khi user bắt đầu sửa ───────────
    const clearError = (field: keyof RegisterFormErrors) => {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // ── Validate ────────────────────────────────────────────
    const validate = (): boolean => {
        const newErrors: RegisterFormErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Gọi API đăng ký ─────────────────────────────────────
    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType: 'MEMBER',
                    email: email.trim().toLowerCase(),
                    fullName: fullName.trim(),
                    password,
                }),
            });

            const data = await response.json();

            // Thay đoạn này trong handleRegister:
            if (response.status === 201 || response.ok) {
                router.push({
                    pathname: '/verify' as any,  // ← đổi từ '/' sang '/verify-otp'
                    params: { email: email.trim().toLowerCase() },
                });
            } else {
                Alert.alert('Lỗi đăng ký', data?.message ?? 'Vui lòng thử lại.');
            }
        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setLoading(false);
        }
    };

    return {
        // state
        fullName, setFullName,
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        loading,
        errors,
        // actions
        clearError,
        handleRegister,
    };
}
