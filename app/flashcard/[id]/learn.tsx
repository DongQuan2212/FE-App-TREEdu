import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StatusBar,
    Animated, Dimensions, Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FlashcardWord } from '../../../src/types/flashcardDetail.types';
import { MOCK_FLASHCARD_DETAIL } from '../../../src/constants/flashcardDetail.constants';

const { width } = Dimensions.get('window');

// ── Mock session data ──────────────────────────────────────
interface LearnSession {
    flashcardTitle: string;
    totalWords: number;
    viewedWordIds: string[];
    viewedWordCount: number;
    progressPercentage: number;
    words: FlashcardWord[];
}

// ── Completion Screen ──────────────────────────────────────
function CompletionScreen({
                              totalWords,
                              onReset,
                              onExit,
                              resetting,
                          }: {
    totalWords: number;
    onReset: () => void;
    onExit: () => void;
    resetting: boolean;
}) {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <View
                className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-6"
            >
                <Text style={{ fontSize: 48 }}>🏆</Text>
            </View>

            <Text className="text-[28px] font-extrabold text-gray-900 mb-3 text-center">
                Tuyệt vời!
            </Text>
            <Text className="text-[15px] text-gray-500 text-center leading-6 mb-10">
                Bạn đã hoàn thành tất cả{' '}
                <Text className="font-bold text-emerald-600">{totalWords}</Text>{' '}
                từ vựng trong bộ này.
            </Text>

            <View style={{ gap: 12, width: '100%' }}>
                <TouchableOpacity
                    onPress={onReset}
                    disabled={resetting}
                    className="h-[54px] bg-gray-900 rounded-2xl flex-row items-center justify-center gap-2"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 10,
                        elevation: 5,
                    }}
                    activeOpacity={0.85}
                >
                    {resetting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                            <Text className="text-base font-bold text-white">Học lại từ đầu</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onExit}
                    className="h-[54px] bg-white border border-gray-200 rounded-2xl items-center justify-center"
                    activeOpacity={0.75}
                >
                    <Text className="text-base font-semibold text-gray-700">Quay lại chi tiết</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ── Main component ─────────────────────────────────────────
export default function FlashcardLearnScreen() {
    const { id }  = useLocalSearchParams<{ id: string }>();
    const router  = useRouter();

    const [session, setSession]     = useState<LearnSession | null>(null);
    const [loading, setLoading]     = useState(true);
    const [resetting, setResetting] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // Flip animation
    const flipAnim = useRef(new Animated.Value(0)).current;

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const flipToFront = () => {
        Animated.spring(flipAnim, {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    };

    const flipToBack = () => {
        Animated.spring(flipAnim, {
            toValue: 180,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    };

    const handleFlip = () => {
        if (isFlipped) {
            flipToFront();
        } else {
            flipToBack();
        }
        setIsFlipped(prev => !prev);
    };

    // ── Load (thay bằng API) ────────────────────────────────
    useEffect(() => {
        setTimeout(() => {
            setSession({
                flashcardTitle:    MOCK_FLASHCARD_DETAIL.title,
                totalWords:        MOCK_FLASHCARD_DETAIL.words.length,
                viewedWordIds:     [],
                viewedWordCount:   0,
                progressPercentage: 0,
                words:             MOCK_FLASHCARD_DETAIL.words,
            });
            setLoading(false);
        }, 600);
    }, [id]);

    // ── Next word ──────────────────────────────────────────
    const handleNext = () => {
        if (!session) return;
        const unviewed = session.words.filter(
            w => !session.viewedWordIds.includes(w.id)
        );
        if (!unviewed[0]) return;

        const wordId   = unviewed[0].id;
        const newViewed = [...session.viewedWordIds, wordId];
        const newCount  = newViewed.length;
        const pct       = Math.round((newCount / session.totalWords) * 100);

        // Lật về mặt trước trước khi chuyển từ
        flipToFront();
        setTimeout(() => {
            setIsFlipped(false);
            setSession(prev => prev ? {
                ...prev,
                viewedWordIds:      newViewed,
                viewedWordCount:    newCount,
                progressPercentage: pct,
            } : prev);
        }, 300);
    };

    // ── Reset ──────────────────────────────────────────────
    const handleReset = () => {
        Alert.alert('Học lại từ đầu?', 'Tiến độ hiện tại sẽ bị xóa.', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Học lại',
                style: 'destructive',
                onPress: () => {
                    setResetting(true);
                    setTimeout(() => {
                        setSession(prev => prev ? {
                            ...prev,
                            viewedWordIds:      [],
                            viewedWordCount:    0,
                            progressPercentage: 0,
                        } : prev);
                        flipToFront();
                        setIsFlipped(false);
                        setResetting(false);
                    }, 500);
                },
            },
        ]);
    };

    // ── Render ─────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#F9FAFB] items-center justify-center">
                <ActivityIndicator size="large" color="#22C55E" />
                <Text className="text-sm text-gray-400 mt-3">Đang tải bài học...</Text>
            </SafeAreaView>
        );
    }

    if (!session) return null;

    const unviewed   = session.words.filter(w => !session.viewedWordIds.includes(w.id));
    const isCompleted = unviewed.length === 0;
    const currentWord = unviewed[0];

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <View className="flex-1 px-5 pt-4 pb-6">

                {/* ── Top bar ── */}
                <View className="flex-row items-start justify-between mb-6">
                    <View className="flex-1 pr-4">
                        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                            {session.flashcardTitle}
                        </Text>
                        <Text className="text-xs text-gray-400 mt-0.5">Chế độ học từ vựng</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={18} color="#374151" />
                    </TouchableOpacity>
                </View>

                {/* ── Progress bar ── */}
                {!isCompleted && (
                    <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Tiến độ
                            </Text>
                            <Text className="text-[11px] font-bold text-gray-500">
                                {session.viewedWordCount} / {session.totalWords}
                            </Text>
                        </View>
                        <View className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${session.progressPercentage}%` }}
                            />
                        </View>
                    </View>
                )}

                {/* ── Content ── */}
                {isCompleted ? (
                    <CompletionScreen
                        totalWords={session.totalWords}
                        onReset={handleReset}
                        onExit={() => router.back()}
                        resetting={resetting}
                    />
                ) : (
                    <View className="flex-1 items-center">
                        {/* ── Flip card ── */}
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={handleFlip}
                            style={{
                                width: '100%',
                                height: width * 0.88,
                                maxHeight: 420,
                            }}
                        >
                            {/* FRONT */}
                            <Animated.View
                                style={[
                                    {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        transform: [{ rotateY: frontInterpolate }],
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 24,
                                        borderBottomWidth: 4,
                                        borderBottomColor: '#E5E7EB',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.08,
                                        shadowRadius: 16,
                                        elevation: 6,
                                    },
                                ]}
                            >
                                {/* Từ mới badge */}
                                <View className="absolute top-5 left-5 bg-emerald-50 px-3 py-1 rounded-full">
                                    <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                        Từ mới
                                    </Text>
                                </View>

                                <View className="flex-1 items-center justify-center px-6">
                                    {/* Image */}
                                    {currentWord.imageURL ? (
                                        <Image
                                            source={{ uri: currentWord.imageURL }}
                                            style={{ width: 140, height: 140, borderRadius: 16, marginBottom: 20 }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                width: 140, height: 140,
                                                borderRadius: 16,
                                                backgroundColor: '#F1F5F9',
                                                marginBottom: 20,
                                            }}
                                        />
                                    )}

                                    {/* Word */}
                                    <Text
                                        style={{ fontSize: 44, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 10 }}
                                        numberOfLines={2}
                                        adjustsFontSizeToFit
                                    >
                                        {currentWord.newWord}
                                    </Text>

                                    {/* Phoneme */}
                                    {currentWord.phoneme ? (
                                        <View className="flex-row items-center gap-2">
                                            <Text className="text-lg text-gray-400">
                                                /{currentWord.phoneme}/
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {/* play audio */}}
                                                className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                                            >
                                                <Ionicons name="volume-medium-outline" size={15} color="#6B7280" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : null}
                                </View>

                                {/* Hint */}
                                <Text
                                    style={{
                                        position: 'absolute', bottom: 20,
                                        alignSelf: 'center',
                                        fontSize: 12, color: '#9CA3AF',
                                    }}
                                >
                                    Chạm để xem nghĩa
                                </Text>
                            </Animated.View>

                            {/* BACK */}
                            <Animated.View
                                style={[
                                    {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        transform: [{ rotateY: backInterpolate }],
                                        backgroundColor: '#F0FDF4',
                                        borderRadius: 24,
                                        borderBottomWidth: 4,
                                        borderBottomColor: '#86EFAC',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.08,
                                        shadowRadius: 16,
                                        elevation: 6,
                                    },
                                ]}
                            >
                                {/* Định nghĩa badge */}
                                <View className="absolute top-5 left-5 bg-white px-3 py-1 rounded-full border border-emerald-100">
                                    <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                        Định nghĩa
                                    </Text>
                                </View>

                                <View className="flex-1 items-center justify-center px-6" style={{ gap: 20 }}>
                                    {/* Meaning */}
                                    <View className="items-center">
                                        <Text className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">
                                            Ý nghĩa
                                        </Text>
                                        <Text
                                            style={{ fontSize: 32, fontWeight: '800', color: '#111827', textAlign: 'center' }}
                                            adjustsFontSizeToFit
                                            numberOfLines={3}
                                        >
                                            {currentWord.meaning}
                                        </Text>
                                    </View>

                                    {/* Example */}
                                    {currentWord.example ? (
                                        <View
                                            className="bg-white rounded-2xl px-5 py-4 border border-emerald-100"
                                            style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.04,
                                                shadowRadius: 6,
                                                elevation: 2,
                                                maxWidth: '90%',
                                            }}
                                        >
                                            <Text className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5">
                                                Ví dụ
                                            </Text>
                                            <Text className="text-sm text-gray-600 italic leading-5">
                                                "{currentWord.example}"
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            </Animated.View>
                        </TouchableOpacity>

                        {/* ── Next button ── */}
                        <TouchableOpacity
                            onPress={handleNext}
                            className="mt-8 flex-row items-center gap-3 px-9 py-4 bg-gray-900 rounded-2xl"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.18,
                                shadowRadius: 14,
                                elevation: 7,
                            }}
                            activeOpacity={0.85}
                        >
                            <Text className="text-base font-bold text-white">Tiếp theo</Text>
                            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
