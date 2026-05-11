// src/types/pronunciation.types.ts

// ── BE Response ───────────────────────────────────────────────────────────────
// GET /api/pronunciation-check/topics
export interface TopicResponse {
    id:            string;
    name:          string;
    description:   string;
    level:         string;   // BE trả về string: "1", "2", "3"
    sentenceCount: number;
}

// GET /api/pronunciation-check/random-sentence?topic=xxx
// Response: ApiResponse<string> — data là câu string thẳng

// POST /api/pronunciation-check
export interface PronunciationCheckResponse {
    id:                  string;
    expectedText:        string;
    recognizedText:      string;
    pronunciationScore:  number;
    pronunciationErrors: PronunciationError[];
}

export interface PronunciationError {
    original:    string;
    recognized:  string;
    index:       number;
    type:        string;
    explanation: string;
}

// ── Local / UI types ──────────────────────────────────────────────────────────
// Topic dùng trong filter/list (map từ TopicResponse)
export interface Topic {
    id:          string;
    name:        string;
    description: string;
    level:       number;   // parse sang number cho dễ so sánh
    icon:        string;
    sentenceCount: number;
}

export type SortOption = 'name' | 'level';
