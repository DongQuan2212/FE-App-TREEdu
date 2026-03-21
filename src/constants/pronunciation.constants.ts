import { Topic } from '../types/pronunciation.types';

// ── Level badge colors ─────────────────────────────────────
// Dùng inline style vì NativeWind không hỗ trợ dynamic color value
export const LEVEL_CONFIG: Record<number, {
    bg: string;
    text: string;
    border: string;
    areaBg: string;
    iconColor: string;
}> = {
    1: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', areaBg: '#F0FDF4', iconColor: '#86EFAC' },
    2: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', areaBg: '#EFF6FF', iconColor: '#93C5FD' },
    3: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', areaBg: '#FFFBEB', iconColor: '#FCD34D' },
};

export const SORT_OPTIONS = [
    { value: 'name'  as const, label: 'Tên A → Z' },
    { value: 'level' as const, label: 'Cấp độ' },
];

// ── Mock data — thay bằng API call sau ────────────────────
export const MOCK_TOPICS: Topic[] = [
    { id: '1', name: 'Động vật',   description: 'Chủ đề về các loài vật quen thuộc. Level 1 gồm câu ngắn, từ dễ và phát âm cơ bản.',          level: 1, icon: 'paw-outline'       },
    { id: '2', name: 'Gia đình',   description: 'Chủ đề về các thành viên trong gia đình. Level 1 gồm câu ngắn, từ dễ và phát âm.',            level: 1, icon: 'people-outline'    },
    { id: '3', name: 'Trường học', description: 'Chủ đề về trường lớp, giáo viên và học sinh. Luyện từ vựng học đường.',                       level: 2, icon: 'school-outline'     },
    { id: '4', name: 'Thức ăn',   description: 'Chủ đề về đồ ăn, thức uống. Level 2 dùng câu mô tả ngắn và trung bình.',                      level: 2, icon: 'restaurant-outline' },
    { id: '5', name: 'Công việc', description: 'Chủ đề về nghề nghiệp và môi trường làm việc. Level 3 gồm câu dài, có nhiều mô tả chi tiết.', level: 3, icon: 'briefcase-outline'  },
    { id: '6', name: 'Du lịch',   description: 'Chủ đề về trải nghiệm du lịch, nơi chốn. Level 3 gồm câu dài có nhiều mô tả.',                level: 3, icon: 'airplane-outline'   },
];
