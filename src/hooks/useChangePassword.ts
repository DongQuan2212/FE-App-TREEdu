import { useState } from 'react';
import axios        from 'axios'; // Hoặc instance axios của bạn
import { AUTH_API } from '../constants/authApi';
import { ChangePasswordRequest, ChangePasswordResponse } from '../types/auth.types';

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const changePassword = async (data: ChangePasswordRequest) => {
        setLoading(true);
        try {
            const response = await axios.post<ChangePasswordResponse>(
                AUTH_API.CHANGE_PASSWORD,
                {}, // Body trống vì bạn dùng params
                {
                    params: {
                        oldPassword: data.oldPassword,
                        newPassword: data.newPassword,
                    },
                    // Đừng quên thêm Authorization Header nếu API yêu cầu token
                }
            );
            return { success: true, message: response.data.message };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra'
            };
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading };
};
