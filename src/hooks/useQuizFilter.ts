import { useState, useMemo } from 'react';
import { QuizSortOption } from '../types/quiz.types';
import { MOCK_QUIZZES } from '../constants/quiz.constants';

export function useQuizFilter() {
    const [search, setSearch]               = useState('');
    const [level, setLevel]                 = useState('all');
    const [sortBy, setSortBy]               = useState<QuizSortOption>('title');
    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [showSortMenu,  setShowSortMenu]  = useState(false);

    const closeMenus = () => {
        setShowLevelMenu(false);
        setShowSortMenu(false);
    };

    const filtered = useMemo(() => {
        return MOCK_QUIZZES
            .filter(q => {
                const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
                const matchLevel  = level === 'all' || q.level === Number(level);
                return matchSearch && matchLevel;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'title':         return a.title.localeCompare(b.title);
                    case 'level':         return a.level - b.level;
                    case 'timer':         return a.timer - b.timer;
                    case 'questionCount': return a.questionCount - b.questionCount;
                    default:              return 0;
                }
            });
    }, [search, level, sortBy]);

    return {
        search, setSearch,
        level,  setLevel,
        sortBy, setSortBy,
        showLevelMenu, setShowLevelMenu,
        showSortMenu,  setShowSortMenu,
        closeMenus,
        filtered,
    };
}
