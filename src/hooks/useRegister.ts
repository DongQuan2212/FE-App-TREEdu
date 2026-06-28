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

    // Đã xóa avatarUrl vì quản lý file ảnh trực tiếp bên RegisterScreen

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
    // Nhận avatarFile từ file Screen truyền vào
    const handleRegister = async (avatarFile?: any) => {
        if (!validate()) return;

        setLoading(true);
        try {
            // Sử dụng FormData để gửi file ảnh thay vì JSON
            const formData = new FormData();

            formData.append('fullName', fullName.trim());
            formData.append('email', email.trim().toLowerCase());
            formData.append('password', password);
            formData.append('rePassword', rePassword);
            formData.append('gender', gender);

            if (phoneNumber.trim()) formData.append('phone', phoneNumber.trim());
            if (birthYear) formData.append('birthYear', birthYear);
            if (address.trim()) formData.append('address', address.trim());

            // Xử lý đính kèm file ảnh cho React Native
            if (avatarFile) {
                formData.append('avatarFile', {
                    uri: avatarFile.uri,
                    name: avatarFile.fileName || 'avatar.jpg',
                    type: avatarFile.mimeType || 'image/jpeg',
                } as any);
            }

            // Gửi request bằng fetch (Lưu ý: Bỏ qua Content-Type để hệ thống tự động sinh ra header multipart kèm boundary)
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.status === 201 || response.ok) {
                // Đăng ký thành công, tự động chuyển sang màn hình Verify
                router.push({
                    pathname: '/verify' as any,
                    params: {
                        email: email.trim().toLowerCase(),
                        type: 'SIGNUP' // Thêm type để màn hình OTP biết đây là luồng đăng ký
                    },
                });
            } else {
                Alert.alert('Lỗi đăng ký', data?.message ?? 'Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi kết nối khi đăng ký:', error);
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
