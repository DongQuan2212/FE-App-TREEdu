// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/src/constants/notificationApi'; // Nhớ sửa lại đường dẫn nếu cần

export interface NotificationEntry {
    _id: string;
    title: string;
    content: string;
    type?: string;
    isRead: boolean;
    createdAt: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
    const [unreadCount, setUnreadCount]     = useState(0);
    const [loading, setLoading]             = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            // Gọi song song 2 API cho lẹ
            const [listRes, countRes] = await Promise.all([
                notificationApi.getMyNotifications(),
                notificationApi.getUnreadCount()
            ]);

            // Xử lý bóc tách data giống như useLeaderboard
            const items = listRes?.data?.data || listRes?.data || listRes || [];
            const count = countRes?.data?.count ?? countRes?.data ?? countRes ?? 0;

            setNotifications(Array.isArray(items) ? items : []);
            setUnreadCount(typeof count === 'number' ? count : 0);
        } catch (error) {
            console.error('[useNotifications] Lỗi fetch:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            // Cập nhật local state để UI phản hồi ngay lập tức
            setNotifications((prev) =>
                prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif)
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('[useNotifications] Lỗi markAsRead:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications((prev) => prev.map(notif => ({ ...notif, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('[useNotifications] Lỗi markAllAsRead:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        refresh: fetchNotifications,
        markAsRead,
        markAllAsRead
    };
}
