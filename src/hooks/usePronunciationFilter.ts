// src/hooks/usePronunciationFilter.ts
import { useState, useEffect, useMemo } from 'react';
import { getTopicsApi }       from '../constants/pronunciationApi';
import { mapTopicResponse }   from '../constants/pronunciation.constants';
import type { Topic, SortOption } from '../types/pronunciation.types';

export function usePronunciationFilter() {
    // ── Data state ────────────────────────────────────────────────────────────
    const [topics,     setTopics]     = useState<Topic[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // ── Filter state ──────────────────────────────────────────────────────────
    const [search, setSearch]               = useState('');
    const [level,  setLevel]               = useState('all');
    const [sortBy, setSortBy]              = useState<SortOption>('name');
    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [showSortMenu,  setShowSortMenu]  = useState(false);

    // ── Fetch topics ──────────────────────────────────────────────────────────
    const fetchTopics = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const res = await getTopicsApi();
            setTopics(res.map(mapTopicResponse));
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Không thể tải danh sách chủ đề.';
            setError(msg);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchTopics(); }, []);

    const refresh = () => fetchTopics(true);

    // ── Filter + sort ─────────────────────────────────────────────────────────
    const filtered = useMemo<Topic[]>(() => {
        return topics
            .filter(t => {
                const q = search.toLowerCase();
                const matchSearch = t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q);
                const matchLevel = level === 'all' || t.level === Number(level);
                return matchSearch && matchLevel;
            })
            .sort((a, b) =>
                sortBy === 'level'
                    ? a.level - b.level
                    : a.name.localeCompare(b.name, 'vi')
            );
    }, [topics, search, level, sortBy]);

    const closeMenus = () => {
        setShowLevelMenu(false);
        setShowSortMenu(false);
    };

    return {
        search, setSearch,
        level,  setLevel,
        sortBy, setSortBy,
        showLevelMenu, setShowLevelMenu,
        showSortMenu,  setShowSortMenu,
        closeMenus,
        filtered,
        loading,
        error,
        refreshing,
        refresh,
    };
}
