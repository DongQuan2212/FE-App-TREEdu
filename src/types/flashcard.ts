export interface Flashcard {
    id:          string;
    title:       string;
    description: string;
    level:       number;
    topic:       string;
    type:        'SYSTEM' | 'BY_MEMBER';   // ← đúng với BE
    createdBy:   string | null;
    visibility:  'PUBLIC' | 'PRIVATE';
    isOwner:     boolean | null;
    isViolated:  boolean | null;
    reportCount: number | null;
    wordCount:   number;
    createdAt:   string;
    updatedAt:   string;
}

export interface FlashcardListResponse {
    success:   boolean;
    status:    number;
    message:   string;
    data:      Flashcard[];
    timestamp: string;
}
