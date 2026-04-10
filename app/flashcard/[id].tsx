import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StatusBar,
    TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
    FlashcardDetail, FlashcardWord, WordFormState,
} from '../../src/types/flashcardDetail.types';
import {
    EMPTY_WORD_FORM,
    MOCK_FLASHCARD_DETAIL,
    WORD_FORM_LABELS,
} from '../../src/constants/flashcardDetail.constants';
import WordCard      from '../../src/components/flashcard/WordCard';
import WordFormModal from '../../src/components/flashcard/WordFormModal';

export default function FlashcardDetailScreen() {
    const { id }  = useLocalSearchParams<{ id: string }>();
    const router  = useRouter();

    const [flashcard, setFlashcard] = useState<FlashcardDetail | null>(null);
    const [loading, setLoading]     = useState(true);

    // Modal state
    const [showAdd,  setShowAdd]  = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editWord, setEditWord] = useState<FlashcardWord | null>(null);
    const [form, setForm]         = useState<WordFormState>(EMPTY_WORD_FORM);

    // ── Load (thay bằng API) ───────────────────────────────
    useEffect(() => {
        setTimeout(() => {
            setFlashcard(MOCK_FLASHCARD_DETAIL);
            setLoading(false);
        }, 600);
    }, [id]);

    const handleChange = (field: keyof WordFormState, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm(EMPTY_WORD_FORM);
        setEditWord(null);
    };

    // ── Add word ───────────────────────────────────────────
    const handleAddWord = () => {
        if (!form.newWord.trim() || !form.meaning.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập từ vựng và nghĩa.');
            return;
        }
        const newWord: FlashcardWord = {
            id: Date.now().toString(),
            ...form,
        };
        setFlashcard(prev => prev ? {
            ...prev,
            words: [...prev.words, newWord],
            wordCount: prev.wordCount + 1,
        } : prev);
        setShowAdd(false);
        resetForm();
    };

    // ── Edit word ──────────────────────────────────────────
    const handleEditClick = (word: FlashcardWord) => {
        setEditWord(word);
        setForm({
            newWord:  word.newWord,
            meaning:  word.meaning,
            example:  word.example  ?? '',
            wordForm: word.wordForm,
            phoneme:  word.phoneme  ?? '',
            imageURL: word.imageURL ?? '',
            audioURL: word.audioURL ?? '',
        });
        setShowEdit(true);
    };

    const handleUpdateWord = () => {
        if (!form.newWord.trim() || !form.meaning.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập từ vựng và nghĩa.');
            return;
        }
        setFlashcard(prev => prev ? {
            ...prev,
            words: prev.words.map(w =>
                w.id === editWord?.id ? { ...w, ...form } : w
            ),
        } : prev);
        setShowEdit(false);
        resetForm();
    };

    // ── Delete word ────────────────────────────────────────
    const handleDeleteWord = (wordId: string) => {
        setFlashcard(prev => prev ? {
            ...prev,
            words: prev.words.filter(w => w.id !== wordId),
            wordCount: prev.wordCount - 1,
        } : prev);
    };

    // ── Level badge config ─────────────────────────────────
    const LEVEL_CONFIG: Record<number, { bg: string; text: string }> = {
        1: { bg: '#DCFCE7', text: '#15803D' },
        2: { bg: '#D1FAE5', text: '#047857' },
        3: { bg: '#FEF9C3', text: '#A16207' },
        4: { bg: '#FFEDD5', text: '#C2410C' },
        5: { bg: '#FEE2E2', text: '#B91C1C' },
        6: { bg: '#F3E8FF', text: '#7E22CE' },
    };

    // ── Loading ────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#22C55E" />
            </SafeAreaView>
        );
    }

    if (!flashcard) return null;

    const lv = LEVEL_CONFIG[flashcard.level] ?? { bg: '#F4F4F5', text: '#71717A' };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Back button ── */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="flex-row items-center gap-1.5 self-start bg-white border border-gray-200 px-3 py-2 rounded-xl mb-4"
                    activeOpacity={0.75}
                >
                    <Ionicons name="arrow-back" size={16} color="#374151" />
                    <Text className="text-sm font-semibold text-gray-700">Bộ của tôi</Text>
                </TouchableOpacity>

                {/* ── Info card ── */}
                <View
                    className="bg-white border border-gray-200 rounded-2xl p-5 mb-5"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 }}
                >
                    {/* Title + Actions */}
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
                    </View>

                    {/* Action buttons */}
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={() => setShowAdd(true)}
                            className="flex-1 flex-row items-center justify-center gap-1.5 h-[42px] bg-gray-900 rounded-xl"
                            activeOpacity={0.85}
                        >
                            <Ionicons name="add" size={18} color="#FFFFFF" />
                            <Text className="text-[13px] font-bold text-white">Thêm từ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-center gap-1.5 h-[42px] px-4 bg-white border border-gray-200 rounded-xl"
                            activeOpacity={0.80}
                        >
                            <Ionicons name="copy-outline" size={16} color="#374151" />
                            <Text className="text-[13px] font-semibold text-gray-700">Excel</Text>
                        </TouchableOpacity>

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

                {/* ── Word list header ── */}
                <View className="flex-row items-center gap-2 mb-3">
                    <Ionicons name="layers-outline" size={18} color="#6B7280" />
                    <Text className="text-base font-bold text-gray-900">
                        Danh sách từ vựng ({flashcard.wordCount})
                    </Text>
                </View>

                {/* ── Words ── */}
                {flashcard.words.length === 0 ? (
                    <View className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-12 items-center">
                        <Ionicons name="book-outline" size={40} color="#D1D5DB" />
                        <Text className="text-base text-gray-500 mt-3 mb-5">Chưa có từ vựng nào.</Text>
                        <TouchableOpacity
                            onPress={() => setShowAdd(true)}
                            className="flex-row items-center gap-2 px-5 py-3 bg-[#22C55E] rounded-xl"
                        >
                            <Ionicons name="add" size={18} color="#FFFFFF" />
                            <Text className="text-sm font-bold text-white">Thêm từ đầu tiên</Text>
                        </TouchableOpacity>
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

            {/* ── Add Modal ── */}
            <WordFormModal
                visible={showAdd}
                title="Thêm từ mới vào Flashcard"
                form={form}
                actionText="Thêm từ"
                onChange={handleChange}
                onSubmit={handleAddWord}
                onClose={() => { setShowAdd(false); resetForm(); }}
            />

            {/* ── Edit Modal ── */}
            <WordFormModal
                visible={showEdit}
                title={`Chỉnh sửa: ${editWord?.newWord ?? ''}`}
                form={form}
                actionText="Cập nhật"
                onChange={handleChange}
                onSubmit={handleUpdateWord}
                onClose={() => { setShowEdit(false); resetForm(); }}
            />
        </SafeAreaView>
    );
}
