import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';

export function useForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSend = async () => {
        if (!email.trim()) {
            setError('Vui lòng nhập email');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email không hợp lệ');
            return;
        }

        setLoading(true);
        try {
            await fetch(
                `${API_ENDPOINTS.forgotPassword}?email=${encodeURIComponent(email.trim().toLowerCase())}`,
                { method: 'POST' }
            );
            // Luôn chuyển trang dù email có tồn tại hay không (BE trả 200 cả hai trường hợp)
            router.push({
                pathname: '/reset-password',
                params: { email: email.trim().toLowerCase() },
            });
        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setLoading(false);
        }
    };

    return {
        email, setEmail,
        loading, error, setError,
        handleSend,
    };
}
