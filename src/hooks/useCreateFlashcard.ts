import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_ENDPOINTS } from '../constants/api';
import { getToken } from '../utils/storage';

interface CreateFlashcardPayload {
    title: string;
    description: string;
    level: number;
    topic: string;
}

interface FormErrors {
    title?: string;
    description?: string;
    topic?: string;
    level?: string;
}

export function useCreateFlashcard() {
    const router = useRouter();

    const [title,       setTitle]       = useState('');
    const [description, setDescription] = useState('');
    const [topic,       setTopic]       = useState('');
    const [level,       setLevel]       = useState(1);
    const [loading,     setLoading]     = useState(false);
    const [errors,      setErrors]      = useState<FormErrors>({});

    const clearError = (field: keyof FormErrors) =>
        setErrors((prev) => ({ ...prev, [field]: undefined }));

    // ── Validate ─────────────────────────────────────────
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!title.trim())
            newErrors.title = 'Vui lòng nhập tên bộ thẻ';
        else if (title.trim().length < 3)
            newErrors.title = 'Tên bộ thẻ phải có ít nhất 3 ký tự';

        if (!description.trim())
            newErrors.description = 'Vui lòng nhập mô tả';

        if (!topic.trim())
            newErrors.topic = 'Vui lòng nhập chủ đề';

        if (level < 1 || level > 6)
            newErrors.level = 'Cấp độ phải từ 1 đến 6';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Gọi API tạo flashcard ────────────────────────────
    const handleCreate = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const token = await getToken();

            const res = await fetch(API_ENDPOINTS.flashcardList, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    title:       title.trim(),
                    description: description.trim(),
                    level,
                    topic:       topic.trim(),
                } as CreateFlashcardPayload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                Alert.alert('Thành công', 'Tạo bộ thẻ mới thành công!', [
                    {
                        text: 'OK',
                        onPress: () => router.back(), // quay về danh sách
                    },
                ]);
            } else {
                Alert.alert('Lỗi', data?.message ?? 'Tạo flashcard thất bại.');
            }
        } catch {
            Alert.alert('Không thể kết nối', 'Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setLoading(false);
        }
    };

    return {
        title,       setTitle,
        description, setDescription,
        topic,       setTopic,
        level,       setLevel,
        loading,
        errors,
        clearError,
        handleCreate,
    };
}
