export interface Flashcard {
    id: string;
    title: string;
    description: string;
    level: number;
    topic: string;
    type: 'SYSTEM' | 'PERSONAL';
    isOwner: boolean | null;
    wordCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface FlashcardListResponse {
    success: boolean;
    status: number;
    message: string;
    data: Flashcard[];
    timestamp: string;
}
