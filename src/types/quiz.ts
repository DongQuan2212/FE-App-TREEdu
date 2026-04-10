// ── Quiz ────────────────────────────────────────────────
export interface QuizOption {
    answerId: string;
    content: string;
}

export interface QuizQuestion {
    questionId: string;
    content: string;
    options: QuizOption[];
    explanation: string;
}

export interface Quiz {
    id: string;
    title: string;
    topic: string;
    level: number;
    timer: number;           // phút
    questions: QuizQuestion[];
    questionCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface QuizListResponse {
    success: boolean;
    message: string;
    data: {
        content: Quiz[];
        totalElements: number;
        totalPages: number;
        pageNumber: number;
        pageSize: number;
        last: boolean;
        first: boolean;
    };
    timestamp: string;
}
