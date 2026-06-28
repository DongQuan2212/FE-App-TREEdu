import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './api';

export const notificationApi = {
    getMyNotifications: () => axiosClient.get(API_ENDPOINTS.myNotifications),
    getUnreadCount: () => axiosClient.get(API_ENDPOINTS.unreadNotifCount),
    markAsRead: (id: string) => axiosClient.put(API_ENDPOINTS.markNotifRead(id)),
    markAllAsRead: () => axiosClient.put(API_ENDPOINTS.markAllNotifRead)
};
