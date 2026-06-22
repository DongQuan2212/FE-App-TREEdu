import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';
import type { RegisterFormErrors } from '../types/auth';

export function useRegister() {
    const router = useRouter();

    // ── State cũ ────────────────────────────────────────────
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ── State mới ───────────────────────────────────────────
    const [rePassword, setRePassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
    const [showRePassword, setShowRePassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<RegisterFormErrors>({});

    // ── Xoá lỗi của 1 field ─────────────────────────────────
    const clearError = (field: keyof RegisterFormErrors) => {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // ── Validate ────────────────────────────────────────────
    const validate = (): boolean => {
        const newErrors: RegisterFormErrors = {};

        if (!fullName.trim())
            newErrors.fullName = 'Vui lòng nhập họ và tên';

        if (!email.trim())
            newErrors.email = 'Vui lòng nhập email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = 'Email không hợp lệ';

        if (!password)
            newErrors.password = 'Vui lòng nhập mật khẩu';
        else if (password.length < 6)
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

        if (!rePassword)
            newErrors.rePassword = 'Vui lòng nhập lại mật khẩu';
        else if (password !== rePassword)
            newErrors.rePassword = 'Mật khẩu nhập lại không trùng khớp';

        if (phoneNumber) {
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            if (!phoneRegex.test(phoneNumber))
                newErrors.phoneNumber = 'Số điện thoại không đúng định dạng Việt Nam';
        }

        if (birthYear) {
            const year = parseInt(birthYear, 10);
            if (isNaN(year) || year < 1900 || year > 2026)
                newErrors.birthYear = 'Năm sinh phải từ 1900 đến 2026';
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
                    fullName: fullName.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    rePassword,
                    phoneNumber: phoneNumber.trim() || null,
                    avatarUrl: avatarUrl.trim() || null,
                    birthYear: birthYear ? parseInt(birthYear, 10) : null,
                    address: address.trim() || null,
                    gender,
                }),
            });

            const data = await response.json();

            if (response.status === 201 || response.ok) {
                router.push({
                    pathname: '/verify' as any,
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
        // state cũ
        fullName, setFullName,
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        // state mới
        rePassword, setRePassword,
        phoneNumber, setPhoneNumber,
        avatarUrl, setAvatarUrl,
        birthYear, setBirthYear,
        address, setAddress,
        gender, setGender,
        showRePassword, setShowRePassword,
        // chung
        loading,
        errors,
        clearError,
        handleRegister,
    };
}
