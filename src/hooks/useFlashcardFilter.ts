import { useState, useMemo } from 'react';
import { FlashcardSortOption, FlashcardTypeOption } from '../types/flashcard.types';
import { MOCK_FLASHCARDS } from '../constants/flashcard.constants';

export function useFlashcardFilter() {
    const [search, setSearch]               = useState('');
    const [level,  setLevel]                = useState('all');
    const [type,   setType]                 = useState<FlashcardTypeOption>('all');
    const [sortBy, setSortBy]               = useState<FlashcardSortOption>('title');
    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [showTypeMenu,  setShowTypeMenu]  = useState(false);
    const [showSortMenu,  setShowSortMenu]  = useState(false);

    const closeMenus = () => {
        setShowLevelMenu(false);
        setShowTypeMenu(false);
        setShowSortMenu(false);
    };

    const filtered = useMemo(() => {
        return MOCK_FLASHCARDS
            .filter(f => {
                const q = search.toLowerCase();
                const matchSearch = f.title.toLowerCase().includes(q) ||
                    (f.description ?? '').toLowerCase().includes(q);
                const matchLevel = level === 'all' || f.level === Number(level);
                const matchType  = type  === 'all' || f.type  === type;
                return matchSearch && matchLevel && matchType;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'title':     return a.title.localeCompare(b.title);
                    case 'level':     return a.level - b.level;
                    case 'wordCount': return b.wordCount - a.wordCount;
                    default:          return 0;
                }
            });
    }, [search, level, type, sortBy]);

    return {
        search, setSearch,
        level,  setLevel,
        type,   setType,
        sortBy, setSortBy,
        showLevelMenu, setShowLevelMenu,
        showTypeMenu,  setShowTypeMenu,
        showSortMenu,  setShowSortMenu,
        closeMenus,
        filtered,
    };
}
