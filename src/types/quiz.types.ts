export interface Quiz {
    id: string;
    title: string;
    topic: string;
    level: number;
    questionCount: number;
    timer: number;
}

export type QuizSortOption = 'title' | 'level' | 'timer' | 'questionCount';
