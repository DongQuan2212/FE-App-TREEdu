import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './api';

export const leaderboardApi = {
    getTopTotalXp: () => {
        return axiosClient.get(API_ENDPOINTS.leaderboardTotal);
    },
    getTopWeeklyXp: () => {
        return axiosClient.get(API_ENDPOINTS.leaderboardWeekly);
    },
    getTopStreak: () => {
        return axiosClient.get(API_ENDPOINTS.leaderboardStreak);
    }
};
