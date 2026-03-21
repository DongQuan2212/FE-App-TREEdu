import { useState, useMemo } from 'react';
import { Topic, SortOption } from '../types/pronunciation.types';
import { MOCK_TOPICS } from '../constants/pronunciation.constants';

export function usePronunciationFilter() {
    const [search, setSearch]       = useState('');
    const [level, setLevel]         = useState('all');
    const [sortBy, setSortBy]       = useState<SortOption>('name');
    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [showSortMenu,  setShowSortMenu]  = useState(false);

    const closeMenus = () => {
        setShowLevelMenu(false);
        setShowSortMenu(false);
    };

    const filtered = useMemo<Topic[]>(() => {
        return MOCK_TOPICS
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
                    : a.name.localeCompare(b.name)
            );
    }, [search, level, sortBy]);

    return {
        // state
        search, setSearch,
        level,  setLevel,
        sortBy, setSortBy,
        showLevelMenu, setShowLevelMenu,
        showSortMenu,  setShowSortMenu,
        // helpers
        closeMenus,
        filtered,
    };
}
