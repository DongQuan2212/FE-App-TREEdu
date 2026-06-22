import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, ScrollView, StatusBar,
    TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView }          from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons }              from '@expo/vector-icons';
import {
    getFlashcardDetailApi,
    addWordApi, updateWordApi, deleteWordApi,
} from '../../src/constants/flashcardApi';
import { FlashcardDetail, FlashcardWord, WordFormState } from '../../src/types/flashcardDetail.types';
import WordCard      from '../../src/components/flashcard/WordCard';
import WordFormModal from '../../src/components/flashcard/WordFormModal';

const EMPTY_FORM: WordFormState = { newWord: '', meaning: '', wordForm: 'NOUN', phoneme: '' };

const LEVEL_CONFIG: Record<number, { bg: string; text: string }> = {
    1: { bg: '#DCFCE7', text: '#15803D' },
    2: { bg: '#D1FAE5', text: '#047857' },
    3: { bg: '#FEF9C3', text: '#A16207' },
    4: { bg: '#FFEDD5', text: '#C2410C' },
    5: { bg: '#FEE2E2', text: '#B91C1C' },
    6: { bg: '#F3E8FF', text: '#7E22CE' },
};

export default function FlashcardDetailScreen() {
    const { id }  = useLocalSearchParams<{ id: string }>();
    const router  = useRouter();

    const [flashcard, setFlashcard] = useState<FlashcardDetail | null>(null);
    const [loading,   setLoading]   = useState(true);

    const [showAdd,   setShowAdd]   = useState(false);
    const [showEdit,  setShowEdit]  = useState(false);
    const [editWord,  setEditWord]  = useState<FlashcardWord | null>(null);
    const [form,      setForm]      = useState<WordFormState>(EMPTY_FORM);
    const [saving,    setSaving]    = useState(false);

    // ── Fetch ──────────────────────────────────────────────
    const fetchDetail = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await getFlashcardDetailApi(id);
            setFlashcard(data);
        } catch (err: any) {
            Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể tải flashcard.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchDetail(); }, [fetchDetail]);

    const handleChange = (field: keyof WordFormState, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => { setForm(EMPTY_FORM); setEditWord(null); };

    // ── Add word ───────────────────────────────────────────
    const handleAddWord = async () => {
        if (!form.newWord.trim() || !form.meaning.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập từ vựng và nghĩa.');
            return;
        }
        if (!id) return;
        setSaving(true);
        try {
            const newWord = await addWordApi(id, form);
            setFlashcard(prev => prev ? {
                ...prev,
                words:     [...prev.words, newWord],
                wordCount: prev.wordCount + 1,
            } : prev);
            setShowAdd(false);
            resetForm();
        } catch (err: any) {
            Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể thêm từ.');
        } finally {
            setSaving(false);
        }
    };

    // ── Edit word ──────────────────────────────────────────
    const handleEditClick = (word: FlashcardWord) => {
        setEditWord(word);
        setForm({
            newWord:  word.newWord,
            meaning:  word.meaning,
            wordForm: word.wordForm,
            phoneme:  word.phoneme ?? '',
        });
        setShowEdit(true);
    };

    const handleUpdateWord = async () => {
        if (!form.newWord.trim() || !form.meaning.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập từ vựng và nghĩa.');
            return;
        }
        if (!id || !editWord) return;
        setSaving(true);
        try {
            const updated = await updateWordApi(id, editWord.id, form);
            setFlashcard(prev => prev ? {
                ...prev,
                words: prev.words.map(w => w.id === editWord.id ? updated : w),
            } : prev);
            setShowEdit(false);
            resetForm();
        } catch (err: any) {
            Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể cập nhật từ.');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete word ────────────────────────────────────────
    const handleDeleteWord = (wordId: string) => {
        Alert.alert('Xóa từ này?', 'Hành động này không thể hoàn tác.', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa', style: 'destructive',
                onPress: async () => {
                    if (!id) return;
                    try {
                        await deleteWordApi(id, wordId);
                        setFlashcard(prev => prev ? {
                            ...prev,
                            words:     prev.words.filter(w => w.id !== wordId),
                            wordCount: prev.wordCount - 1,
                        } : prev);
                    } catch (err: any) {
                        Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể xóa từ.');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#22C55E" />
            </SafeAreaView>
        );
    }

    if (!flashcard) return null;

    const lv = LEVEL_CONFIG[flashcard.level] ?? { bg: '#F4F4F5', text: '#71717A' };
    const isPublic = flashcard.visibility === 'PUBLIC';

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Back */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="flex-row items-center gap-1.5 self-start bg-white border border-gray-200 px-3 py-2 rounded-xl mb-4"
                    activeOpacity={0.75}
                >
                    <Ionicons name="arrow-back" size={16} color="#374151" />
                    <Text className="text-sm font-semibold text-gray-700">Quay lại</Text>
                </TouchableOpacity>

                {/* Info card */}
                <View
                    className="bg-white border border-gray-200 rounded-2xl p-5 mb-5"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 }}
                >
                    <View className="flex-row items-start justify-between gap-3 mb-3">
                        <View className="flex-1">
                            <Text className="text-[22px] font-extrabold text-gray-900 mb-1">
                                {flashcard.title}
                            </Text>
                            {flashcard.description ? (
                                <Text className="text-sm text-gray-500">{flashcard.description}</Text>
                            ) : null}
                        </View>
                    </View>

                    {/* Badges */}
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: lv.bg }}>
                            <Text className="text-xs font-bold" style={{ color: lv.text }}>
                                Level {flashcard.level}
                            </Text>
                        </View>
                        <View className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                            <Text className="text-xs font-bold text-emerald-700">{flashcard.topic}</Text>
                        </View>
                        <View className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
                            <Text className="text-xs font-bold text-gray-600">{flashcard.wordCount} từ</Text>
                        </View>
                        {/* Visibility badge */}
                        <View className={`flex-row items-center gap-1 px-3 py-1 rounded-full border ${
                            isPublic
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-amber-50 border-amber-200'
                        }`}>
                            <Ionicons
                                name={isPublic ? 'globe-outline' : 'lock-closed-outline'}
                                size={11}
                                color={isPublic ? '#3B82F6' : '#D97706'}
                            />
                            <Text className={`text-xs font-bold ${isPublic ? 'text-blue-600' : 'text-amber-600'}`}>
                                {isPublic ? 'Công khai' : 'Riêng tư'}
                            </Text>
                        </View>
                    </View>

                    {/* Actions — chỉ hiện nút thêm từ nếu là owner */}
                    <View className="flex-row gap-2">
                        {flashcard.isOwner && (
                            <TouchableOpacity
                                onPress={() => setShowAdd(true)}
                                className="flex-1 flex-row items-center justify-center gap-1.5 h-[42px] bg-gray-900 rounded-xl"
                                activeOpacity={0.85}
                            >
                                <Ionicons name="add" size={18} color="#FFFFFF" />
                                <Text className="text-[13px] font-bold text-white">Thêm từ</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => router.push(`/flashcard/${id}/learn` as any)}
                            className="flex-1 flex-row items-center justify-center gap-1.5 h-[42px] bg-[#22C55E] rounded-xl"
                            activeOpacity={0.85}
                        >
                            <Ionicons name="book-outline" size={16} color="#FFFFFF" />
                            <Text className="text-[13px] font-bold text-white">Học ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Word list */}
                <View className="flex-row items-center gap-2 mb-3">
                    <Ionicons name="layers-outline" size={18} color="#6B7280" />
                    <Text className="text-base font-bold text-gray-900">
                        Danh sách từ vựng ({flashcard.wordCount})
                    </Text>
                </View>

                {flashcard.words.length === 0 ? (
                    <View className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-12 items-center">
                        <Ionicons name="book-outline" size={40} color="#D1D5DB" />
                        <Text className="text-base text-gray-500 mt-3 mb-5">Chưa có từ vựng nào.</Text>
                        {flashcard.isOwner && (
                            <TouchableOpacity
                                onPress={() => setShowAdd(true)}
                                className="flex-row items-center gap-2 px-5 py-3 bg-[#22C55E] rounded-xl"
                            >
                                <Ionicons name="add" size={18} color="#FFFFFF" />
                                <Text className="text-sm font-bold text-white">Thêm từ đầu tiên</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    flashcard.words.map(word => (
                        <WordCard
                            key={word.id}
                            word={word}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteWord}
                        />
                    ))
                )}
            </ScrollView>

            {/* Add Modal */}
            <WordFormModal
                visible={showAdd}
                title="Thêm từ mới"
                form={form}
                actionText="Thêm từ"
                onChange={handleChange}
                onSubmit={handleAddWord}
                onClose={() => { setShowAdd(false); resetForm(); }}
            />

            {/* Edit Modal */}
            <WordFormModal
                visible={showEdit}
                title={`Sửa: ${editWord?.newWord ?? ''}`}
                form={form}
                actionText="Cập nhật"
                onChange={handleChange}
                onSubmit={handleUpdateWord}
                onClose={() => { setShowEdit(false); resetForm(); }}
            />
        </SafeAreaView>
    );
}
