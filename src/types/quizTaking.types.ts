export interface QuizOption {
    answerId: string;
    content: string;
}

export interface QuizQuestion {
    questionId: string;
    content: string;
    options: QuizOption[];
}

export interface QuizDetail {
    title: string;
    questions: QuizQuestion[];
}

export interface QuizAttempt {
    attemptId: string;
    quiz: QuizDetail;
    timeRemainingSeconds: number;
}

export interface AnswerResult {
    content: string;
    correct: boolean;
    selectedAnswer: string;
    correctAnswer: string;
    explanation?: string;
}

export interface QuizResult {
    score: number;
    totalQuestions: number;
    percentage: number;
    results: AnswerResult[];
}

export type AnswerMap = Record<string, string>;   // questionId → answerId
export type FlagMap   = Record<string, boolean>;  // questionId → flagged
