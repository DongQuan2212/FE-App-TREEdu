
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { getMyProfileApi } from '../constants/authApi';
import type { UserProfile } from '../types/auth';

export function useMyProfile() {
    const [profile,    setProfile]    = useState<UserProfile | null>(null);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProfile = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const data = await getMyProfileApi();
            setProfile(data);
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Không thể tải thông tin cá nhân.';
            setError(msg);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const refresh = () => fetchProfile(true);

    return { profile, loading, error, refreshing, refresh };
}
