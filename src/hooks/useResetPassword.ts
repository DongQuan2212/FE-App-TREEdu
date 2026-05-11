import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';

export function useResetPassword(email: string) {
    const router = useRouter();

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [errors, setErrors] = useState<{
        otp?: string; newPassword?: string; confirmPassword?: string;
    }>({});

    // ── Đếm ngược 5 phút ────────────────────────────────────
    const [seconds, setSeconds] = useState(300);
    useEffect(() => {
        if (seconds <= 0) return;
        const t = setTimeout(() => setSeconds(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [seconds]);

    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');

    // ── Validate ─────────────────────────────────────────────
    const validate = () => {
        const e: typeof errors = {};
        if (otp.length < 6) e.otp = 'Vui lòng nhập đủ 6 chữ số';
        if (!newPassword) e.newPassword = 'Vui lòng nhập mật khẩu mới';
        else if (newPassword.length < 6) e.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        else if (confirmPassword !== newPassword) e.confirmPassword = 'Mật khẩu không khớp';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const clearError = (field: keyof typeof errors) =>
        setErrors(prev => ({ ...prev, [field]: undefined }));

    // ── Gửi lại OTP ──────────────────────────────────────────
    const handleResend = async () => {
        setResendLoading(true);
        try {
            const res = await fetch(
                `${API_ENDPOINTS.resendOtp}?email=${encodeURIComponent(email)}&type=RESET_PASSWORD`,
                { method: 'POST' }
            );
            if (res.ok) {
                setSeconds(300); // reset timer
                setOtp('');
                Alert.alert('Đã gửi lại', 'Mã OTP mới đã được gửi về email của bạn.');
            } else {
                const data = await res.json();
                Alert.alert('Lỗi', data?.message ?? 'Không thể gửi lại mã OTP.');
            }
        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setResendLoading(false);
        }
    };

    // ── Submit ────────────────────────────────────────────────
    const handleReset = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.resetPassword, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                Alert.alert(
                    'Thành công',
                    'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.',
                    [{ text: 'Đăng nhập', onPress: () => router.replace('/') }]
                );
            } else {
                // Lỗi OTP sai/hết hạn trả về đúng field
                if (data?.message?.includes('OTP')) {
                    setErrors(prev => ({ ...prev, otp: data.message }));
                } else {
                    Alert.alert('Lỗi', data?.message ?? 'Vui lòng thử lại.');
                }
            }
        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setLoading(false);
        }
    };

    return {
        otp, setOtp,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        showConfirm, setShowConfirm,
        loading, resendLoading,
        errors, clearError,
        seconds, mm, ss,
        handleResend, handleReset,
    };
}
