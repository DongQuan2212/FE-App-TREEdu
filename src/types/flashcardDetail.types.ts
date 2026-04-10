export type WordForm =
    | 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB'
    | 'PRONOUN' | 'PREPOSITION' | 'CONJUNCTION' | 'INTERJECTION';

export interface FlashcardWord {
    id: string;
    newWord: string;
    meaning: string;
    example?: string;
    wordForm: WordForm;
    phoneme?: string;
    imageURL?: string;
    audioURL?: string;
}

export interface FlashcardDetail {
    id: string;
    title: string;
    description?: string;
    level: number;
    topic: string;
    wordCount: number;
    type: 'SYSTEM' | 'BY_MEMBER';
    words: FlashcardWord[];
}

export interface WordFormState {
    newWord: string;
    meaning: string;
    example: string;
    wordForm: WordForm;
    phoneme: string;
    imageURL: string;
    audioURL: string;
}

export interface CreateFlashcardForm {
    title: string;
    description: string;
    level: number;
    topic: string;
}

export interface CreateFlashcardErrors {
    title?: string;
    description?: string;
    topic?: string;
}
