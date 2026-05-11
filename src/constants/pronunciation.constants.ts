// src/constants/pronunciation.constants.ts
import type { Topic, TopicResponse } from '../types/pronunciation.types';

// ── Level badge colors ────────────────────────────────────────────────────────
export const LEVEL_CONFIG: Record<number, {
    bg:        string;
    text:      string;
    border:    string;
    iconColor: string;
}> = {
    1: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', iconColor: '#4ADE80' },
    2: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', iconColor: '#60A5FA' },
    3: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', iconColor: '#FBBF24' },
};

// ── Icon map theo tên topic (khớp với web FE) ─────────────────────────────────
export const TOPIC_ICON_MAP: Record<string, string> = {
    'Động vật':   'paw-outline',
    'Gia đình':   'people-outline',
    'Trường học': 'school-outline',
    'Thức ăn':    'restaurant-outline',
    'Công việc':  'briefcase-outline',
    'Du lịch':    'airplane-outline',
};

/** Lấy icon theo tên topic, fallback về layers */
export const getTopicIcon = (name: string): string =>
    TOPIC_ICON_MAP[name] ?? 'layers-outline';

// ── Sort options ──────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
    { value: 'name'  as const, label: 'Tên A → Z' },
    { value: 'level' as const, label: 'Cấp độ'    },
];

// ── Adapter: TopicResponse (BE) → Topic (UI) ─────────────────────────────────
export const mapTopicResponse = (t: TopicResponse): Topic => ({
    id:            t.id,
    name:          t.name,
    description:   t.description,
    level:         Number(t.level),   // BE trả string "1"/"2"/"3" → parse number
    icon:          getTopicIcon(t.name),
    sentenceCount: t.sentenceCount,
});
