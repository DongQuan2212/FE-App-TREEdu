import { Quiz } from '../types/quiz';

export const LEVEL_CONFIG: Record<number, { bg: string; text: string }> = {
    1: { bg: '#DCFCE7', text: '#15803D' },
    2: { bg: '#D1FAE5', text: '#047857' },
    3: { bg: '#FEF9C3', text: '#A16207' },
    4: { bg: '#FFEDD5', text: '#C2410C' },
    5: { bg: '#FEE2E2', text: '#B91C1C' },
    6: { bg: '#F3E8FF', text: '#7E22CE' },
};

export const SORT_OPTIONS = [
    { value: 'title'         as const, label: 'Tên A → Z'  },
    { value: 'level'         as const, label: 'Cấp độ'     },
    { value: 'timer'         as const, label: 'Thời gian'  },
    { value: 'questionCount' as const, label: 'Số câu'     },
];

export const LEVEL_OPTIONS = [
    { value: 'all', label: 'Cấp độ'  },
    { value: '1',   label: 'Level 1' },
    { value: '2',   label: 'Level 2' },
    { value: '3',   label: 'Level 3' },
    { value: '4',   label: 'Level 4' },
    { value: '5',   label: 'Level 5' },
    { value: '6',   label: 'Level 6' },
];
