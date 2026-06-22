import { useState } from 'react';
import { Alert }    from 'react-native';
import { useRouter } from 'expo-router';
import { createFlashcardApi } from '../constants/flashcardApi';

interface CreateErrors {
    title?:       string;
    description?: string;
    topic?:       string;
}

export function useCreateFlashcard() {
    const router = useRouter();

    const [title,       setTitle]       = useState('');
    const [description, setDescription] = useState('');
    const [topic,       setTopic]       = useState('');
    const [level,       setLevel]       = useState(1);
    const [visibility,  setVisibility]  = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE');
    const [loading,     setLoading]     = useState(false);
    const [errors,      setErrors]      = useState<CreateErrors>({});

    const clearError = (field: keyof CreateErrors) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const e: CreateErrors = {};
        if (!title.trim())       e.title = 'Vui lòng nhập tên bộ thẻ';
        if (!topic.trim())       e.topic = 'Vui lòng nhập chủ đề';
        if (title.trim().length < 3) e.title = 'Tên bộ thẻ phải ít nhất 3 ký tự';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleCreate = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const result = await createFlashcardApi({
                title:       title.trim(),
                description: description.trim(),
                topic:       topic.trim(),
                level,
                visibility,
            });
            Alert.alert('Thành công', 'Bộ thẻ đã được tạo!', [
                { text: 'OK', onPress: () => router.replace(`/flashcard/${result.id}` as any) },
            ]);
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Không thể tạo bộ thẻ.';
            Alert.alert('Lỗi', msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        title,       setTitle,
        description, setDescription,
        topic,       setTopic,
        level,       setLevel,
        visibility,  setVisibility,
        loading,
        errors,
        clearError,
        handleCreate,
    };
}
