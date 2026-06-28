// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../constants/axiosClient';
import { API_ENDPOINTS } from '../constants/api';

/** Shape khớp với response của /users/me */
export interface ProfileData {
    id:                     string;
    fullName:               string;
    email:                  string;
    phoneNumber:            string | null;
    avatarUrl:              string ;
    birthYear:              number | null;
    address:                string | null;
    gender:                 'MALE' | 'FEMALE' | 'OTHER' | null;
    streakCount:            number;
    longestStreak:          number;
    xp:                     number;
    level:                  number;
    totalQuizCompleted:     number;
    totalFlashcardLearned:  number;
    lastStudyDate:          string | null;
    xpNeededForNextLevel:   number;
    currentLevelProgressXp: number;
    progressPercentage:     number;

}

interface UseProfileReturn {
    profile:   ProfileData | null;
    loading:   boolean;
    error:     string | null;
    refetch:   () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axiosClient.get(API_ENDPOINTS.myProfile);
            // BE có thể wrap trong { data: ... } hoặc trả thẳng object
            setProfile(data?.data ?? data);
        } catch (err: any) {
            console.error('useProfile error:', err);
            setError(err?.response?.data?.message ?? 'Không thể tải thông tin hồ sơ');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile };
}
