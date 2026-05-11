import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';

export function useVerifyOtp(email: string) {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length < 6) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã OTP đầy đủ.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.verifyOtp, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Thành công', 'Tài khoản đã được kích hoạt!', [
                    { text: 'Đăng nhập', onPress: () => router.replace('/' as any) },
                ]);
            } else {
                Alert.alert('Lỗi', data?.message ?? 'Mã OTP không đúng. Vui lòng thử lại.');
            }
        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            const response = await fetch(
                `${API_ENDPOINTS.resendOtp}?email=${encodeURIComponent(email)}&type=SIGNUP`,
                { method: 'POST' }
            );
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Đã gửi lại', 'Mã OTP mới đã được gửi về email của bạn.');
            } else {
                Alert.alert('Lỗi', data?.message ?? 'Không thể gửi lại mã OTP.');
            }
        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setResendLoading(false);
        }
    };

    return {
        otp, setOtp,
        loading, resendLoading,
        handleVerify, handleResend,
    };
}
