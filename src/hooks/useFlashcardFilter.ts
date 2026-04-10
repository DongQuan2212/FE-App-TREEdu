import { useState, useMemo } from 'react';
import { useFlashcardList } from './useFlashcardList';
import { SORT_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS } from '../constants/flashcard.constants';

type SortValue  = typeof SORT_OPTIONS[number]['value'];
type LevelValue = typeof LEVEL_OPTIONS[number]['value'];
type TypeValue  = typeof TYPE_OPTIONS[number]['value'];

export function useFlashcardFilter() {
    const { flashcards, loading, error, refreshing, refresh } = useFlashcardList();

    const [search,        setSearch]        = useState('');
    const [level,         setLevel]         = useState<LevelValue>('all');
    const [type,          setType]          = useState<TypeValue>('all');
    const [sortBy,        setSortBy]        = useState<SortValue>(SORT_OPTIONS[0].value);
    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [showTypeMenu,  setShowTypeMenu]  = useState(false);
    const [showSortMenu,  setShowSortMenu]  = useState(false);

    const closeMenus = () => {
        setShowLevelMenu(false);
        setShowTypeMenu(false);
        setShowSortMenu(false);
    };

    const filtered = useMemo(() => {
        let result = [...flashcards];

        // ── Search ───────────────────────────────────────
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (fc) =>
                    fc.title.toLowerCase().includes(q) ||
                    fc.topic.toLowerCase().includes(q) ||
                    fc.description.toLowerCase().includes(q)
            );
        }

        // ── Filter level ─────────────────────────────────
        if (level !== 'all') {
            result = result.filter((fc) => fc.level === Number(level));
        }

        // ── Filter type ──────────────────────────────────
        if (type !== 'all') {
            result = result.filter((fc) => fc.type === type);
        }

        // ── Sort ─────────────────────────────────────────
        result.sort((a, b) => {
            switch (sortBy) {
                case 'title':     return a.title.localeCompare(b.title);
                case 'level':     return a.level - b.level;
                case 'wordCount': return a.wordCount - b.wordCount;
                default:          return 0;
            }
        });

        return result;
    }, [flashcards, search, level, type, sortBy]);

    return {
        search, setSearch,
        level,  setLevel:  setLevel  as (v: string) => void,
        type,   setType:   setType   as (v: string) => void,
        sortBy, setSortBy: setSortBy as (v: string) => void,
        showLevelMenu, setShowLevelMenu,
        showTypeMenu,  setShowTypeMenu,
        showSortMenu,  setShowSortMenu,
        closeMenus,
        filtered,
        loading,
        error,
        refreshing,
        refresh,
    };
}
