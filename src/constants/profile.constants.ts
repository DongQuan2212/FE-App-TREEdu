import { User, MenuSection } from '../types/profile.types';

// ── Mock user — thay bằng auth context sau ────────────────
export const MOCK_USER: User = {
    name:     'Quân Đông',
    email:    'builedongquan22122004@gmail.com',
    role:     'Thành viên',
    initials: 'QĐ',
};

export const MENU_SECTIONS: MenuSection[] = [
    {
        id: 'activity',
        title: 'Hoạt động',
        items: [
            {
                id:      'quiz-history',
                icon:    'time-outline',
                label:   'Lịch sử học tập',
                sub:     'Các lần làm bài quiz',
                route:   '/quiz/history',
                color:   '#22C55E',
                bgColor: '#F0FDF4',
            },
            {
                id:      'flashcard-history',
                icon:    'layers-outline',
                label:   'Lịch sử Flashcard',
                sub:     'Bộ thẻ đã luyện tập',
                route:   '/profile/flashcard-history',
                color:   '#3B82F6',
                bgColor: '#EFF6FF',
            },
        ],
    },
    {
        id: 'account',
        title: 'Tài khoản',
        items: [
            {
                id:      'change-password',
                icon:    'lock-closed-outline',
                label:   'Đổi mật khẩu',
                sub:     'Cập nhật mật khẩu mới',
                route:   '/profile/change-password',
                color:   '#F59E0B',
                bgColor: '#FFFBEB',
            },
        ],
    },
];
