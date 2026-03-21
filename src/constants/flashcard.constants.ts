import { Flashcard } from '../types/flashcard.types';

export const LEVEL_CONFIG: Record<number, { bg: string; text: string }> = {
    1: { bg: '#DCFCE7', text: '#15803D' },
    2: { bg: '#D1FAE5', text: '#047857' },
    3: { bg: '#FEF9C3', text: '#A16207' },
    4: { bg: '#FFEDD5', text: '#C2410C' },
    5: { bg: '#FEE2E2', text: '#B91C1C' },
};

export const TYPE_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    SYSTEM:    { bg: '#EFF6FF', text: '#1D4ED8', label: 'Hệ thống' },
    BY_MEMBER: { bg: '#F5F3FF', text: '#6D28D9', label: 'Của bạn'  },
};

export const SORT_OPTIONS = [
    { value: 'title'     as const, label: 'Tên A → Z'    },
    { value: 'level'     as const, label: 'Cấp độ'       },
    { value: 'wordCount' as const, label: 'Số lượng từ'  },
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

// ── Mock data — thay bằng API sau ─────────────────────────
export const MOCK_FLASHCARDS: Flashcard[] = [
    { id: '1', title: 'Từ vựng gia đình',   topic: 'Cuộc sống', level: 1, type: 'SYSTEM',    wordCount: 30, description: 'Các từ liên quan đến gia đình và người thân.' },
    { id: '2', title: 'Động từ thông dụng', topic: 'Ngữ pháp',  level: 2, type: 'SYSTEM',    wordCount: 50, description: 'Những động từ hay gặp nhất trong tiếng Việt.' },
    { id: '3', title: 'Bộ từ vựng cá nhân', topic: 'Tự học',    level: 3, type: 'BY_MEMBER', wordCount: 18, description: 'Bộ từ tôi tự tạo để luyện tập hàng ngày.' },
    { id: '4', title: 'Thành ngữ phổ biến', topic: 'Văn hoá',   level: 4, type: 'SYSTEM',    wordCount: 25, description: 'Các thành ngữ hay gặp trong giao tiếp.' },
    { id: '5', title: 'Từ vựng công việc',  topic: 'Công việc', level: 3, type: 'BY_MEMBER', wordCount: 40, description: 'Từ vựng dùng trong môi trường công sở.' },
    { id: '6', title: 'Số đếm & thời gian', topic: 'Cơ bản',    level: 1, type: 'SYSTEM',    wordCount: 20, description: 'Số đếm, ngày tháng, giờ giấc.' },
];
