export interface Flashcard {
    id: string;
    title: string;
    topic: string;
    level: number;
    type: 'SYSTEM' | 'BY_MEMBER';
    wordCount: number;
    description?: string;
}

export type FlashcardSortOption = 'title' | 'level' | 'wordCount';
export type FlashcardTypeOption = 'all' | 'SYSTEM' | 'BY_MEMBER';
