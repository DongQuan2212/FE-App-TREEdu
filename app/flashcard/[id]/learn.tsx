import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StatusBar,
    Animated, Dimensions, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView }          from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons }              from '@expo/vector-icons';
import {
    startLearnApi, markWordViewedApi, resetLearnApi,
} from '../../../src/constants/flashcardApi';
import { FlashcardWord } from '../../../src/types/flashcardDetail.types';

const { width } = Dimensions.get('window');

// ── XP / Level-up banner ───────────────────────────────────
function XpBanner({ xp, leveledUp, level, onDismiss }: {
    xp: number; leveledUp: boolean; level: number; onDismiss: () => void;
}) {
    return (
        <View style={{
            position: 'absolute', bottom: 100, left: 20, right: 20, zIndex: 99,
            backgroundColor: '#FFFFFF',
            borderRadius: 20, padding: 20,
            shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
            borderWidth: 1, borderColor: '#F3F4F6',
        }}>
            {leveledUp && (
                <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 6, backgroundColor: '#FFFBEB', borderRadius: 12,
                    paddingVertical: 8, marginBottom: 12,
                    borderWidth: 1, borderColor: '#FDE68A',
                }}>
                    <Ionicons name="flash" size={16} color="#D97706" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400E' }}>
                        🎊 Thăng cấp! Bạn đã lên Cấp {level}
                    </Text>
                </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                <Ionicons name="star" size={22} color="#F59E0B" />
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>+{xp} XP</Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>nhận được!</Text>
            </View>
            <TouchableOpacity
                onPress={onDismiss}
                style={{ backgroundColor: '#111827', borderRadius: 14, height: 46, alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.85}
            >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>Tuyệt vời! 🎉</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Completion Screen ──────────────────────────────────────
function CompletionScreen({ totalWords, onReset, onExit, resetting }: {
    totalWords: number; onReset: () => void; onExit: () => void; resetting: boolean;
}) {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <View className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-6">
                <Text style={{ fontSize: 48 }}>🏆</Text>
            </View>
            <Text className="text-[28px] font-extrabold text-gray-900 mb-3 text-center">Tuyệt vời!</Text>
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
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 }}
                    activeOpacity={0.85}
                >
                    {resetting
                        ? <ActivityIndicator size="small" color="#FFFFFF" />
                        : <>
                            <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                            <Text className="text-base font-bold text-white">Học lại từ đầu</Text>
                        </>
                    }
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

// ── Main ───────────────────────────────────────────────────
export default function FlashcardLearnScreen() {
    const { id }  = useLocalSearchParams<{ id: string }>();
    const router  = useRouter();

    const [words,        setWords]        = useState<FlashcardWord[]>([]);
    const [flashcardTitle, setFlashcardTitle] = useState('');
    const [totalWords,   setTotalWords]   = useState(0);
    const [viewedIds,    setViewedIds]    = useState<string[]>([]);
    const [loading,      setLoading]      = useState(true);
    const [resetting,    setResetting]    = useState(false);
    const [isFlipped,    setIsFlipped]    = useState(false);

    // XP banner
    const [xpBanner, setXpBanner] = useState<{ xp: number; level: number; leveledUp: boolean } | null>(null);

    // Flip animation
    const flipAnim = useRef(new Animated.Value(0)).current;
    const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
    const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });

    const animateTo = (val: number) => {
        Animated.spring(flipAnim, { toValue: val, friction: 8, tension: 10, useNativeDriver: true }).start();
    };

    const handleFlip = () => {
        animateTo(isFlipped ? 0 : 180);
        setIsFlipped(p => !p);
    };

    // ── Start session ──────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        (async () => {
            setLoading(true);
            try {
                const session = await startLearnApi(id);
                setFlashcardTitle(session.flashcardTitle ?? '');
                setTotalWords(session.totalWords ?? 0);
                setViewedIds(Array.from(session.viewedWordIds ?? []));
                setWords(session.words ?? []);
            } catch (err: any) {
                Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể bắt đầu học.');
                router.back();
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // ── Next word ──────────────────────────────────────────
    const handleNext = async () => {
        if (!id) return;
        const unviewed = words.filter(w => !viewedIds.includes(w.id));
        if (!unviewed[0]) return;

        const wordId = unviewed[0].id;
        try {
            const res = await markWordViewedApi(id, wordId);

            // Lật về front trước
            animateTo(0);
            setTimeout(() => {
                setIsFlipped(false);
                setViewedIds(Array.from(res.viewedWordIds ?? [...viewedIds, wordId]));

                // Hiện XP banner khi hoàn thành (status = DONE)
                if (res.status === 'DONE' && res.xpGained) {
                    setXpBanner({
                        xp:       res.xpGained,
                        level:    res.currentLevel ?? 1,
                        leveledUp: res.leveledUp ?? false,
                    });
                }
            }, 300);
        } catch (err: any) {
            Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể lưu tiến độ.');
        }
    };

    // ── Reset ──────────────────────────────────────────────
    const handleReset = () => {
        Alert.alert('Học lại từ đầu?', 'Tiến độ hiện tại sẽ bị xóa.', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Học lại', style: 'destructive',
                onPress: async () => {
                    if (!id) return;
                    setResetting(true);
                    try {
                        const res = await resetLearnApi(id);
                        setViewedIds([]);
                        animateTo(0);
                        setIsFlipped(false);
                    } catch (err: any) {
                        Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể reset.');
                    } finally {
                        setResetting(false);
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#F9FAFB] items-center justify-center">
                <ActivityIndicator size="large" color="#22C55E" />
                <Text className="text-sm text-gray-400 mt-3">Đang tải bài học...</Text>
            </SafeAreaView>
        );
    }

    const unviewed    = words.filter(w => !viewedIds.includes(w.id));
    const isCompleted = unviewed.length === 0 && words.length > 0;
    const currentWord = unviewed[0];
    const progress    = totalWords > 0 ? Math.round((viewedIds.length / totalWords) * 100) : 0;

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <View className="flex-1 px-5 pt-4 pb-6">

                {/* Top bar */}
                <View className="flex-row items-start justify-between mb-6">
                    <View className="flex-1 pr-4">
                        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                            {flashcardTitle}
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

                {/* Progress bar */}
                {!isCompleted && (
                    <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiến độ</Text>
                            <Text className="text-[11px] font-bold text-gray-500">
                                {viewedIds.length} / {totalWords}
                            </Text>
                        </View>
                        <View className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <View className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                        </View>
                    </View>
                )}

                {/* Content */}
                {isCompleted ? (
                    <CompletionScreen
                        totalWords={totalWords}
                        onReset={handleReset}
                        onExit={() => router.back()}
                        resetting={resetting}
                    />
                ) : currentWord ? (
                    <View className="flex-1 items-center">
                        {/* Flip card */}
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={handleFlip}
                            style={{ width: '100%', height: width * 0.88, maxHeight: 420 }}
                        >
                            {/* FRONT */}
                            <Animated.View style={{
                                position: 'absolute', width: '100%', height: '100%',
                                backfaceVisibility: 'hidden',
                                transform: [{ rotateY: frontInterpolate }],
                                backgroundColor: '#FFFFFF', borderRadius: 24,
                                borderBottomWidth: 4, borderBottomColor: '#E5E7EB',
                                shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
                            }}>
                                <View className="absolute top-5 left-5 bg-emerald-50 px-3 py-1 rounded-full">
                                    <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Từ mới</Text>
                                </View>
                                <View className="flex-1 items-center justify-center px-6" style={{ gap: 12 }}>
                                    <Text
                                        style={{ fontSize: 44, fontWeight: '800', color: '#111827', textAlign: 'center' }}
                                        numberOfLines={2} adjustsFontSizeToFit
                                    >
                                        {currentWord.newWord}
                                    </Text>
                                    {currentWord.phoneme ? (
                                        <View className="flex-row items-center gap-2">
                                            <Text className="text-lg text-gray-400">/{currentWord.phoneme}/</Text>
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={{ position: 'absolute', bottom: 20, alignSelf: 'center', fontSize: 12, color: '#9CA3AF' }}>
                                    Chạm để xem nghĩa
                                </Text>
                            </Animated.View>

                            {/* BACK */}
                            <Animated.View style={{
                                position: 'absolute', width: '100%', height: '100%',
                                backfaceVisibility: 'hidden',
                                transform: [{ rotateY: backInterpolate }],
                                backgroundColor: '#F0FDF4', borderRadius: 24,
                                borderBottomWidth: 4, borderBottomColor: '#86EFAC',
                                shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
                            }}>
                                <View className="absolute top-5 left-5 bg-white px-3 py-1 rounded-full border border-emerald-100">
                                    <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Định nghĩa</Text>
                                </View>
                                <View className="flex-1 items-center justify-center px-6">
                                    <Text className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Ý nghĩa</Text>
                                    <Text
                                        style={{ fontSize: 32, fontWeight: '800', color: '#111827', textAlign: 'center' }}
                                        adjustsFontSizeToFit numberOfLines={3}
                                    >
                                        {currentWord.meaning}
                                    </Text>
                                    {currentWord.wordForm ? (
                                        <View className="mt-4 px-3 py-1 bg-white rounded-full border border-emerald-100">
                                            <Text className="text-xs font-semibold text-emerald-600">{currentWord.wordForm}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            </Animated.View>
                        </TouchableOpacity>

                        {/* Next button */}
                        <TouchableOpacity
                            onPress={handleNext}
                            className="mt-8 flex-row items-center gap-3 px-9 py-4 bg-gray-900 rounded-2xl"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 7 }}
                            activeOpacity={0.85}
                        >
                            <Text className="text-base font-bold text-white">Tiếp theo</Text>
                            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>

            {/* XP Banner */}
            {xpBanner && (
                <XpBanner
                    xp={xpBanner.xp}
                    level={xpBanner.level}
                    leveledUp={xpBanner.leveledUp}
                    onDismiss={() => setXpBanner(null)}
                />
            )}
        </SafeAreaView>
    );
}
