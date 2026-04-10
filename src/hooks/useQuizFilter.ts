import { useState, useMemo } from 'react';
import { useQuizList } from './useQuizList';
import { SORT_OPTIONS, LEVEL_OPTIONS } from '../constants/quiz.constants';

// Lấy type trực tiếp từ constants → không bao giờ bị lệch
type SortValue  = typeof SORT_OPTIONS[number]['value'];   // 'title' | 'level' | 'timer' | 'questionCount'
type LevelValue = typeof LEVEL_OPTIONS[number]['value'];  // 'all' | '1' | '2' | ...

export function useQuizFilter() {
    const { quizzes, loading, error, refreshing, refresh } = useQuizList();

    const [search,        setSearch]        = useState('');
    const [level,         setLevel]         = useState<LevelValue>('all');
    const [sortBy,        setSortBy]        = useState<SortValue>('title');
    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [showSortMenu,  setShowSortMenu]  = useState(false);

    const closeMenus = () => {
        setShowLevelMenu(false);
        setShowSortMenu(false);
    };

    const filtered = useMemo(() => {
        let result = [...quizzes];

        // ── Search ───────────────────────────────────────
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (quiz) =>
                    quiz.title.toLowerCase().includes(q) ||
                    quiz.topic.toLowerCase().includes(q)
            );
        }

        // ── Filter level ('all' = không lọc) ────────────
        if (level !== 'all') {
            result = result.filter((quiz) => quiz.level === Number(level));
        }

        // ── Sort ─────────────────────────────────────────
        result.sort((a, b) => {
            switch (sortBy) {
                case 'title':         return a.title.localeCompare(b.title);
                case 'level':         return a.level - b.level;
                case 'timer':         return a.timer - b.timer;
                case 'questionCount': return a.questionCount - b.questionCount;
                default:              return 0;
            }
        });

        return result;
    }, [quizzes, search, level, sortBy]);

    return {
        search, setSearch,
        level,  setLevel: setLevel as (v: string) => void,
        sortBy, setSortBy: setSortBy as (v: string) => void,
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
