export interface FlashcardWord {
    id:        string;
    flashcardId: string;
    newWord:   string;
    meaning:   string;
    wordForm:  string;
    phoneme:   string | null;
    audioURL:  string | null;
    createdAt: string;
    updatedAt: string;
}

export interface FlashcardDetail {
    id:          string;
    title:       string;
    description: string;
    level:       number;
    topic:       string;
    type:        string;
    createdBy:   string | null;
    visibility:  'PUBLIC' | 'PRIVATE';
    isOwner:     boolean;
    isViolated:  boolean | null;
    wordCount:   number;
    words:       FlashcardWord[];
    createdAt:   string;
    updatedAt:   string;
}

export interface WordFormState {
    newWord:  string;
    meaning:  string;
    wordForm: string;
    phoneme:  string;
}
