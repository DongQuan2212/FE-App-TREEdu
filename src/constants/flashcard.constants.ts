export const LEVEL_CONFIG: Record<number, { bg: string; text: string }> = {
    1: { bg: '#DCFCE7', text: '#15803D' },
    2: { bg: '#D1FAE5', text: '#047857' },
    3: { bg: '#FEF9C3', text: '#A16207' },
    4: { bg: '#FFEDD5', text: '#C2410C' },
    5: { bg: '#FEE2E2', text: '#B91C1C' },
};

export const TYPE_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    SYSTEM:    { bg: '#EFF6FF', text: '#1D4ED8', label: 'Hệ thống'  },
    BY_MEMBER: { bg: '#F5F3FF', text: '#6D28D9', label: 'Thành viên' },
};

export const SORT_OPTIONS = [
    { value: 'title'     as const, label: 'Tên A → Z'   },
    { value: 'level'     as const, label: 'Cấp độ'      },
    { value: 'wordCount' as const, label: 'Số lượng từ' },
];

export const LEVEL_OPTIONS = [
    { value: 'all', label: 'Cấp độ'  },
    { value: '1',   label: 'Level 1' },
    { value: '2',   label: 'Level 2' },
    { value: '3',   label: 'Level 3' },
    { value: '4',   label: 'Level 4' },
    { value: '5',   label: 'Level 5' },
];

export const TYPE_OPTIONS = [
    { value: 'all',       label: 'Tất cả loại' },
    { value: 'SYSTEM',    label: 'Hệ thống'    },
    { value: 'BY_MEMBER', label: 'Của tôi'     },
];

export const VISIBILITY_OPTIONS = [
    { value: 'all',     label: 'Mọi chế độ'  },
    { value: 'PUBLIC',  label: '🌍 Công khai' },
    { value: 'PRIVATE', label: '🔒 Riêng tư'  },
];
