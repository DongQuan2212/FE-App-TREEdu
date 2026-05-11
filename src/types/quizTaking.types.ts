// src/types/quizTaking.types.ts

// ── API Request ───────────────────────────────────────────────────────────────
export interface UserAnswerRequest {
    questionId:       string;
    selectedAnswerId: string;   // ← phải khớp với BE: selectedAnswerId, không phải answerId
}

export interface SubmitQuizRequest {
    attemptId: string;
    answers:   UserAnswerRequest[];
}

// ── API Response — Start ──────────────────────────────────────────────────────
// POST /quiz/{id}/start
export interface StartQuizResponse {
    attemptId:            string;
    quiz:                 QuizDetail;
    timeRemainingSeconds: number;
    expiresAt:            string;
}

// ── API Response — Submit ─────────────────────────────────────────────────────
// POST /quiz/{id}/submit → QuizAttemptResponse
export interface QuizAttemptResponse {
    attemptId:      string;
    quizTitle:      string;
    score:          number;
    totalQuestions: number;
    percentage:     number;
    results:        QuestionResult[];
    submittedAt:    string;
}

export interface QuestionResult {
    questionId:      string;
    content:         string;
    selectedAnswer:  string;   // content của đáp án user chọn
    correctAnswer:   string;   // content của đáp án đúng
    correct:         boolean;
    explanation:     string | null;
}

// ── Quiz Detail (từ startQuiz.quiz) ──────────────────────────────────────────
export interface QuizDetail {
    id:            string;
    title:         string;
    topic:         string;
    level:         number;
    timer:         number;       // phút
    questions:     QuizQuestion[];
    questionCount: number;
}

export interface QuizQuestion {
    questionId: string;
    content:    string;
    options:    QuizOption[];
    explanation: string | null;  // null khi đang làm bài (BE ẩn)
}

export interface QuizOption {
    answerId: string;
    content:  string;
}

// ── Local state types ─────────────────────────────────────────────────────────
/** key = questionId, value = answerId đã chọn */
export type AnswerMap = Record<string, string>;

/** key = questionId, value = có đánh dấu không */
export type FlagMap = Record<string, boolean>;

// QuizResult giờ chính là QuizAttemptResponse
export type QuizResult = QuizAttemptResponse;
