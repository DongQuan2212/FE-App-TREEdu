// src/types/quizHistory.types.ts
// Types cho lịch sử làm bài quiz — khớp với QuizAttemptResponse từ BE

export interface QuestionResult {
    questionId:     string;
    content:        string;
    selectedAnswer: string;
    correctAnswer:  string;
    correct:        boolean;
    explanation:    string | null;
}

export interface QuizAttemptSummary {
    attemptId:      string;
    quizTitle:      string;
    score:          number;
    totalQuestions: number;
    percentage:     number;
    results:        QuestionResult[] | null;   // null trong danh sách, có data trong detail
    submittedAt:    string;                    // ISO datetime string
}
