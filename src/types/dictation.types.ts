// Định nghĩa chặt chẽ các cấp độ để TypeScript gợi ý lỗi nếu gõ sai
export type DictationLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Cấu trúc của một đoạn cắt âm thanh (Segment)
export interface DictationSegment {
    id?: string | number;
    startTime: number;
    endTime: number;
    transcript: string;
}

// Cấu trúc bài nghe hiển thị ở màn Danh sách (List)
export interface Dictation {
    id: string; // Tuỳ backend của bạn trả về string (UUID) hay number
    title: string;
    level: DictationLevel;
    audioUrl: string;
    segments: DictationSegment[];
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    createdAt?: string;
    updatedAt?: string;
}

// Cấu trúc Chi tiết bài nghe (Kế thừa toàn bộ từ Dictation và thêm các trường chi tiết)
export interface DictationDetail extends Dictation {
    transcript?: string; // Nội dung đầy đủ (nếu backend có trả về)
    authorId?: string;
}
export interface CheckAnswerPayload {
    segmentId: number; // Đổi từ answer -> segmentId
    userText: string;  // Đổi từ answer -> userText
}

// Chi tiết từng từ đúng/sai
export interface WordDetail {
    word: string;
    status: 'CORRECT' | 'INCORRECT' | string;
}

// Kết quả trả về sau khi nộp bài
export interface CheckAnswerResult {
    accuracy: number;
    passed: boolean;
    correctAnswer: string;
    wordDetails: WordDetail[];
}
