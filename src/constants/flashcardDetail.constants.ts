import { WordForm, FlashcardWord, FlashcardDetail } from '../types/flashcardDetail.types';

export const WORD_FORM_LABELS: Record<WordForm, string> = {
    NOUN:         'Danh từ',
    VERB:         'Động từ',
    ADJECTIVE:    'Tính từ',
    ADVERB:       'Trạng từ',
    PRONOUN:      'Đại từ',
    PREPOSITION:  'Giới từ',
    CONJUNCTION:  'Liên từ',
    INTERJECTION: 'Thán từ',
};

export const WORD_FORM_OPTIONS: { value: WordForm; label: string }[] = [
    { value: 'NOUN',         label: 'Danh từ'  },
    { value: 'VERB',         label: 'Động từ'  },
    { value: 'ADJECTIVE',    label: 'Tính từ'  },
    { value: 'ADVERB',       label: 'Trạng từ' },
    { value: 'PRONOUN',      label: 'Đại từ'   },
    { value: 'PREPOSITION',  label: 'Giới từ'  },
    { value: 'CONJUNCTION',  label: 'Liên từ'  },
    { value: 'INTERJECTION', label: 'Thán từ'  },
];

export const EMPTY_WORD_FORM = {
    newWord: '', meaning: '', example: '',
    wordForm: 'NOUN' as WordForm,
    phoneme: '', imageURL: '', audioURL: '',
};

// ── Mock data — thay bằng API sau ─────────────────────────
export const MOCK_FLASHCARD_DETAIL: FlashcardDetail = {
    id: '1',
    title: 'Bob',
    description: 'vegrgergre',
    level: 6,
    topic: 'Tiếng Việt',
    wordCount: 3,
    type: 'BY_MEMBER',
    words: [
        { id: 'w1', newWord: 'Ăn',   meaning: 'Eat',   wordForm: 'VERB', phoneme: '/ʔan/', example: 'Tôi ăn cơm mỗi ngày.' },
        { id: 'w2', newWord: 'Uống', meaning: 'Drink',  wordForm: 'VERB', phoneme: '/uəŋ/', example: 'Anh uống nước không?' },
        { id: 'w3', newWord: 'Ngủ',  meaning: 'Sleep',  wordForm: 'VERB', phoneme: '/ŋu/',  example: 'Em ngủ lúc mấy giờ?' },
    ],
};
