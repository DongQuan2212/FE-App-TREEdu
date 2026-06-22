// src/hooks/useLeaderboard.ts
import { useState, useEffect, useCallback } from 'react';
import { leaderboardApi } from '@/src/constants/leaderboardApi';

export interface LeaderboardEntry {
    rank:        number;
    userId:      string;
    displayName: string;
    value:       number;
    level:       number;
    treeStage:   string | null;
    change:      number;
}

interface LeaderboardResponse {
    entries: LeaderboardEntry[];
    myRank?: number;
}

// axiosClient thường trả về response.data tự động,
// nhưng một số interceptor wrap thêm lớp { data: ... }
// Hàm này xử lý cả hai trường hợp
function extractEntries(res: any): LeaderboardEntry[] {
    if (!res) return [];

    // Trường hợp 1: axiosClient trả thẳng { entries: [...] }
    if (Array.isArray(res.entries)) return res.entries;

    // Trường hợp 2: axiosClient wrap thêm -> { data: { entries: [...] } }
    if (res.data && Array.isArray(res.data.entries)) return res.data.entries;

    // Trường hợp 3: response chính là mảng
    if (Array.isArray(res)) return res;

    console.warn('[useLeaderboard] Không nhận dạng được cấu trúc response:', res);
    return [];
}

export function useLeaderboard(type: 'WEEKLY_XP' | 'STREAK' | 'TOTAL_XP' = 'TOTAL_XP') {
    const [data,    setData]    = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [myRank,  setMyRank]  = useState<number | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            let response: any;

            switch (type) {
                case 'WEEKLY_XP': response = await leaderboardApi.getTopWeeklyXp(); break;
                case 'STREAK':    response = await leaderboardApi.getTopStreak();    break;
                default:          response = await leaderboardApi.getTopTotalXp();   break;
            }

            const entries = extractEntries(response);
            setData(entries);

            // Lấy myRank nếu có
            const rank = response?.myRank ?? response?.data?.myRank ?? null;
            setMyRank(rank);
        } catch (error) {
            console.error('[useLeaderboard] Lỗi fetch:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    return { data, loading, myRank, refresh: fetchLeaderboard };
}
