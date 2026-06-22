import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, TextInput, Pressable, ActivityIndicator,
    SafeAreaView, StatusBar, ScrollView, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { getDictationDetailApi, checkDictationAnswerApi } from '../../src/constants/dictationAPI';
import type { DictationDetail, CheckAnswerResult } from '../../src/types/dictation.types';

const MAX_LISTEN = 3;
const PASS_ACCURACY = 80;
const SPEEDS = [0.75, 1, 1.25];

const countWords = (text: string) =>
    text ? text.trim().split(/\s+/).filter(Boolean) : [];

// ─── Màn hình kết quả ──────────────────────────────────────────────────────────
function ResultScreen({ results, lesson, onRestart, onBack }: any) {
    const total = results.length;
    const passed = results.filter((r: any) => r.passed).length;
    const avg = total > 0
        ? Math.round(results.reduce((s: number, r: any) => s + (r.accuracy || 0), 0) / total)
        : 0;

    const grade =
        avg >= 90 ? { label: 'Xuất sắc', color: '#059669', icon: '🏆' } :
            avg >= 80 ? { label: 'Tốt', color: '#0284c7', icon: '🎯' } :
                avg >= 60 ? { label: 'Khá', color: '#d97706', icon: '📈' } :
                    { label: 'Cần luyện thêm', color: '#dc2626', icon: '💪' };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center', paddingTop: 40 }}>
                <Text style={{ fontSize: 56 }}>{grade.icon}</Text>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#0f172a', marginTop: 12 }}>
                    Hoàn thành!
                </Text>
                <Text style={{ color: '#64748b', marginTop: 4, marginBottom: 24, textAlign: 'center' }}>
                    {lesson?.title}
                </Text>

                {/* Điểm tổng */}
                <View style={{
                    width: '100%', backgroundColor: '#fff', borderRadius: 20,
                    borderWidth: 1, borderColor: '#e2e8f0', padding: 24,
                    alignItems: 'center', marginBottom: 16
                }}>
                    <Text style={{ fontSize: 60, fontWeight: '700', color: grade.color, lineHeight: 68 }}>
                        {avg}%
                    </Text>
                    <View style={{
                        marginTop: 8, paddingHorizontal: 16, paddingVertical: 4,
                        borderRadius: 100, backgroundColor: grade.color + '20'
                    }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: grade.color }}>
                            {grade.label}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginBottom: 16 }}>
                    <View style={{
                        flex: 1, backgroundColor: '#f0fdf4', borderRadius: 16,
                        borderWidth: 1, borderColor: '#bbf7d0', padding: 16, alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 28, fontWeight: '700', color: '#059669' }}>{passed}</Text>
                        <Text style={{ fontSize: 13, color: '#16a34a', marginTop: 2 }}>Đoạn đạt ✓</Text>
                    </View>
                    <View style={{
                        flex: 1, backgroundColor: '#fef2f2', borderRadius: 16,
                        borderWidth: 1, borderColor: '#fecaca', padding: 16, alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 28, fontWeight: '700', color: '#dc2626' }}>{total - passed}</Text>
                        <Text style={{ fontSize: 13, color: '#dc2626', marginTop: 2 }}>Cần luyện lại</Text>
                    </View>
                </View>

                {/* Chi tiết đoạn */}
                <View style={{
                    width: '100%', backgroundColor: '#fff', borderRadius: 16,
                    borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24, overflow: 'hidden'
                }}>
                    {results.map((r: any, i: number) => (
                        <View key={i} style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            padding: 12, paddingHorizontal: 16,
                            borderBottomWidth: i < results.length - 1 ? 1 : 0,
                            borderBottomColor: '#f1f5f9'
                        }}>
                            <Text style={{ fontSize: 13, color: '#475569', fontWeight: '500' }}>
                                Đoạn #{i + 1}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={{
                                    fontSize: 13, fontWeight: '600',
                                    color: r.passed ? '#059669' : '#dc2626'
                                }}>
                                    {(r.accuracy ?? 0).toFixed(1)}%
                                </Text>
                                <Ionicons
                                    name={r.passed ? 'checkmark-circle' : 'close-circle'}
                                    size={16}
                                    color={r.passed ? '#059669' : '#dc2626'}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                    <Pressable
                        onPress={onRestart}
                        style={{
                            flex: 1, padding: 14, borderRadius: 14,
                            borderWidth: 1, borderColor: '#e2e8f0',
                            backgroundColor: '#fff', alignItems: 'center'
                        }}
                    >
                        <Text style={{ fontWeight: '600', color: '#0f172a' }}>Làm lại</Text>
                    </Pressable>
                    <Pressable
                        onPress={onBack}
                        style={{
                            flex: 1, padding: 14, borderRadius: 14,
                            backgroundColor: '#059669', alignItems: 'center'
                        }}
                    >
                        <Text style={{ fontWeight: '600', color: '#fff' }}>Về danh sách</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Component chính ───────────────────────────────────────────────────────────
export default function DictationDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [lesson, setLesson] = useState<DictationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentSegIndex, setCurrentSegIndex] = useState(0);
    const [userText, setUserText] = useState('');
    const [checkResult, setCheckResult] = useState<CheckAnswerResult | null>(null);
    const [checking, setChecking] = useState(false);
    const [listenCount, setListenCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [finished, setFinished] = useState(false);
    const [speed, setSpeed] = useState(1);

    const soundRef = useRef<Audio.Sound | null>(null);
    const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load lesson
    useEffect(() => {
        (async () => {
            try {
                const data = await getDictationDetailApi(id as string);
                setLesson(data);
            } catch {
                Alert.alert('Lỗi', 'Không thể tải bài nghe!');
                router.back();
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            soundRef.current?.unloadAsync();
            if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        };
    }, [id]);

    const currentSeg = lesson?.segments?.[currentSegIndex];
    const totalSegs = lesson?.segments?.length || 0;
    const progressPct = totalSegs > 0 ? Math.round((currentSegIndex / totalSegs) * 100) : 0;
    const listenLeft = MAX_LISTEN - listenCount;

    // Phát đoạn hiện tại
    const playCurrentSegment = useCallback(async () => {
        if (!lesson?.audioUrl || !currentSeg) return;
        if (listenCount >= MAX_LISTEN) {
            Alert.alert('Hết lượt', `Bạn đã nghe tối đa ${MAX_LISTEN} lần cho đoạn này!`);
            return;
        }
        try {
            if (stopTimerRef.current) clearTimeout(stopTimerRef.current);

            // Tạo sound nếu chưa có
            if (!soundRef.current) {
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                const { sound } = await Audio.Sound.createAsync({ uri: lesson.audioUrl });
                soundRef.current = sound;
            }

            const snd = soundRef.current;
            await snd.setRateAsync(speed, true);
            await snd.setPositionAsync(currentSeg.startTime * 1000);
            await snd.playAsync();
            setIsPlaying(true);
            setListenCount(prev => prev + 1);

            const duration = ((currentSeg.endTime - currentSeg.startTime) * 1000) / speed;
            stopTimerRef.current = setTimeout(async () => {
                await snd.pauseAsync();
                setIsPlaying(false);
            }, duration);
        } catch {
            Alert.alert('Lỗi', 'Không thể phát âm thanh.');
        }
    }, [currentSeg, lesson?.audioUrl, listenCount, speed]);

    const stopAudio = useCallback(async () => {
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        await soundRef.current?.pauseAsync();
        setIsPlaying(false);
    }, []);

    // Check đáp án
    const handleCheck = async () => {
        if (!userText.trim()) {
            Alert.alert('Thông báo', 'Bạn chưa nhập gì cả!');
            return;
        }
        setChecking(true);
        try {
            const result = await checkDictationAnswerApi(id as string, {
                segmentId: Number(currentSeg!.id),
                userText: userText.trim()
            });
            setCheckResult(result);
        } catch {
            Alert.alert('Lỗi', 'Lỗi kiểm tra đáp án!');
        } finally {
            setChecking(false);
        }
    };

    // Hiện đáp án
    const handleShowAnswer = () => {
        if (!currentSeg) return;
        setShowAnswer(true);
        setCheckResult({
            accuracy: 0,
            passed: false,
            correctAnswer: currentSeg.transcript,
            wordDetails: [],
            revealedAnswer: true
        } as any);
    };

    // Qua đoạn tiếp
    const handleNext = async () => {
        const result = checkResult || { accuracy: 0, passed: false };
        const newResults = [...results, {
            segmentId: currentSeg?.id,
            accuracy: result.accuracy || 0,
            passed: result.passed || false
        }];
        setResults(newResults);

        if (currentSegIndex + 1 >= totalSegs) {
            await stopAudio();
            setFinished(true);
        } else {
            setCurrentSegIndex(prev => prev + 1);
            setUserText('');
            setCheckResult(null);
            setListenCount(0);
            setShowAnswer(false);
            await stopAudio();
        }
    };

    const handleRestart = async () => {
        await stopAudio();
        setCurrentSegIndex(0);
        setUserText('');
        setCheckResult(null);
        setListenCount(0);
        setShowAnswer(false);
        setResults([]);
        setFinished(false);
    };

    // ── Loading ──
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={{ marginTop: 12, color: '#64748b', fontSize: 14 }}>Đang tải bài nghe...</Text>
            </SafeAreaView>
        );
    }

    // ── Kết quả ──
    if (finished) {
        return <ResultScreen results={results} lesson={lesson} onRestart={handleRestart} onBack={() => router.push('/dictation' as any)} />;
    }

    const words = countWords(currentSeg?.transcript || '');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* ── Header ── */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 10,
                paddingHorizontal: 16, paddingVertical: 10,
                backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0'
            }}>
                <Pressable
                    onPress={() => router.push('/dictation' as any) }
                    style={{
                        width: 34, height: 34, borderRadius: 17,
                        borderWidth: 1, borderColor: '#e2e8f0',
                        backgroundColor: '#f8fafc',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Ionicons name="arrow-back" size={18} color="#0f172a" />
                </Pressable>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#0f172a' }} numberOfLines={1}>
                    {lesson?.title}
                </Text>
                <View style={{
                    paddingHorizontal: 10, paddingVertical: 3,
                    borderRadius: 100, backgroundColor: '#fef3c7'
                }}>
                    <Text style={{ fontSize: 11, color: '#92400e', fontWeight: '600' }}>{lesson?.level}</Text>
                </View>
            </View>

            {/* ── Progress ── */}
            <View style={{
                backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10,
                borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
                flexDirection: 'row', alignItems: 'center', gap: 12
            }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a' }}>
                    Đoạn {currentSegIndex + 1} / {totalSegs}
                </Text>
                <View style={{ flex: 1, height: 5, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${progressPct}%`, backgroundColor: '#059669', borderRadius: 3 }} />
                </View>
                <Text style={{ fontSize: 12, color: '#64748b' }}>{progressPct}%</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 14, gap: 14, paddingBottom: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Card: Audio player ── */}
                <View style={{
                    backgroundColor: '#fff', borderRadius: 16,
                    borderWidth: 1, borderColor: '#e2e8f0', padding: 16
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <Ionicons name="volume-high" size={15} color="#059669" />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>Phát âm thanh</Text>
                    </View>

                    {/* Visualizer */}
                    <View style={{
                        width: '100%', height: 100, borderRadius: 12, overflow: 'hidden',
                        backgroundColor: '#0f172a',
                        alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'row', gap: 12, marginBottom: 12
                    }}>
                        <View style={{
                            width: 44, height: 44, borderRadius: 22,
                            borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
                            backgroundColor: isPlaying ? '#059669' : 'rgba(255,255,255,0.1)',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Ionicons name="mic" size={20} color="#fff" />
                        </View>
                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                            {isPlaying ? 'Đang phát...' : `Đoạn ${currentSegIndex + 1}`}
                        </Text>
                    </View>

                    {/* Play / Stop */}
                    <Pressable
                        onPress={isPlaying ? stopAudio : playCurrentSegment}
                        disabled={!isPlaying && listenCount >= MAX_LISTEN}
                        style={{
                            paddingVertical: 12, borderRadius: 12, marginBottom: 10,
                            backgroundColor:
                                isPlaying ? '#dc2626' :
                                    listenCount >= MAX_LISTEN ? '#e2e8f0' : '#059669',
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                    >
                        <Ionicons
                            name={isPlaying ? 'stop' : 'play'}
                            size={15}
                            color={listenCount >= MAX_LISTEN && !isPlaying ? '#94a3b8' : '#fff'}
                        />
                        <Text style={{
                            fontWeight: '600', fontSize: 14,
                            color: listenCount >= MAX_LISTEN && !isPlaying ? '#94a3b8' : '#fff'
                        }}>
                            {isPlaying ? 'Dừng' : listenCount === 0 ? 'Nghe đoạn này' : 'Nghe lại'}
                        </Text>
                    </Pressable>

                    {/* Lượt nghe */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        {Array.from({ length: MAX_LISTEN }).map((_, i) => (
                            <View key={i} style={{
                                width: 28, height: 6, borderRadius: 3,
                                backgroundColor: i < listenCount ? '#dc2626' : '#dcfce7',
                                borderWidth: 1,
                                borderColor: i < listenCount ? '#fca5a5' : '#86efac'
                            }} />
                        ))}
                        <Text style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>
                            {listenLeft > 0 ? `còn ${listenLeft} lượt` : 'hết lượt'}
                        </Text>
                    </View>

                    {/* Tốc độ */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                        <Text style={{ fontSize: 12, color: '#94a3b8' }}>Tốc độ:</Text>
                        {SPEEDS.map(s => (
                            <Pressable
                                key={s}
                                onPress={() => setSpeed(s)}
                                style={{
                                    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6,
                                    borderWidth: 1,
                                    borderColor: speed === s ? '#059669' : '#e2e8f0',
                                    backgroundColor: speed === s ? '#f0fdf4' : '#fff'
                                }}
                            >
                                <Text style={{
                                    fontSize: 12, fontWeight: speed === s ? '600' : '400',
                                    color: speed === s ? '#059669' : '#64748b'
                                }}>
                                    {s}x
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* ── Card: Nhập liệu ── */}
                <View style={{
                    backgroundColor: '#fff', borderRadius: 16,
                    borderWidth: 1, borderColor: '#e2e8f0', padding: 16
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <Ionicons name="mic-outline" size={15} color="#059669" />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                            Gõ những gì bạn nghe được
                        </Text>
                    </View>

                    {/* Gợi ý từ */}
                    <View style={{
                        padding: 12, backgroundColor: '#f8fafc',
                        borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12
                    }}>
                        <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 }}>
                            GỢI Ý — {words.length} TỪ
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {words.map((word, i) => (
                                <View key={i} style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                    {showAnswer ? (
                                        <Text style={{ fontSize: 13, color: '#0f172a', fontWeight: '500' }}>{word}</Text>
                                    ) : (
                                        Array.from({ length: Math.min(word.length, 6) }).map((_, j) => (
                                            <View key={j} style={{
                                                width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#cbd5e1'
                                            }} />
                                        ))
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Textarea */}
                    <TextInput
                        value={userText}
                        onChangeText={t => { if (!checkResult) setUserText(t); }}
                        placeholder="Gõ câu trả lời của bạn ở đây..."
                        placeholderTextColor="#94a3b8"
                        multiline
                        textAlignVertical="top"
                        editable={!checkResult}
                        style={{
                            minHeight: 100, padding: 12, borderRadius: 12, fontSize: 15,
                            color: '#0f172a', lineHeight: 24,
                            borderWidth: 1.5,
                            borderColor: checkResult
                                ? (checkResult.passed ? '#86efac' : '#fca5a5')
                                : '#e2e8f0',
                            backgroundColor: checkResult ? '#f8fafc' : '#fff',
                            marginBottom: 12
                        }}
                    />

                    {/* Kết quả check — từng từ */}
                    {checkResult && !(checkResult as any).revealedAnswer && (
                        <View style={{
                            padding: 14, borderRadius: 12, marginBottom: 12,
                            backgroundColor: checkResult.passed ? '#f0fdf4' : '#fef2f2',
                            borderWidth: 1,
                            borderColor: checkResult.passed ? '#bbf7d0' : '#fecaca'
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Ionicons
                                    name={checkResult.passed ? 'checkmark-circle' : 'close-circle'}
                                    size={18}
                                    color={checkResult.passed ? '#059669' : '#dc2626'}
                                />
                                <Text style={{
                                    fontWeight: '700', fontSize: 15,
                                    color: checkResult.passed ? '#059669' : '#dc2626'
                                }}>
                                    {checkResult.accuracy.toFixed(1)}%
                                    {checkResult.passed ? ' — Đạt yêu cầu!' : ` — Chưa đạt (cần ${PASS_ACCURACY}%)`}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                                {checkResult.wordDetails?.map((wd: any, i: number) => (
                                    <View key={i} style={{
                                        paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6,
                                        borderWidth: 1,
                                        backgroundColor: wd.status === 'CORRECT' ? '#dcfce7' : '#fee2e2',
                                        borderColor: wd.status === 'CORRECT' ? '#86efac' : '#fca5a5'
                                    }}>
                                        <Text style={{
                                            fontSize: 13, fontWeight: '500',
                                            color: wd.status === 'CORRECT' ? '#166534' : '#991b1b'
                                        }}>
                                            {wd.word}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Đáp án đúng */}
                    {(checkResult as any)?.revealedAnswer && (
                        <View style={{
                            padding: 14, borderRadius: 12, marginBottom: 12,
                            backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a'
                        }}>
                            <Text style={{ fontSize: 11, color: '#92400e', fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 }}>
                                ĐÁP ÁN ĐÚNG
                            </Text>
                            <Text style={{ fontSize: 14, color: '#0f172a', lineHeight: 22 }}>
                                {checkResult?.correctAnswer}
                            </Text>
                        </View>
                    )}
                </View>

                {/* ── Card: Bản chép ── */}
                <View style={{
                    backgroundColor: '#fff', borderRadius: 16,
                    borderWidth: 1, borderColor: '#e2e8f0', padding: 16
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>Bản chép</Text>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#059669' }}>
                            {results.length > 0
                                ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length) + '%'
                                : '—'}
                        </Text>
                    </View>

                    {lesson?.segments?.map((seg: any, i: number) => {
                        const segResult = results[i];
                        const isCurrent = i === currentSegIndex;
                        const isDone = i < currentSegIndex;
                        const segWords = countWords(seg.transcript);

                        return (
                            <View key={seg.id} style={{
                                padding: 10, borderRadius: 10, marginBottom: 7,
                                borderWidth: 1,
                                borderColor: isCurrent ? '#059669'
                                    : isDone && segResult?.passed ? '#86efac'
                                        : isDone ? '#fca5a5' : '#e2e8f0',
                                backgroundColor: isCurrent ? '#f0fdf4'
                                    : isDone && segResult?.passed ? '#f0fdf4'
                                        : isDone ? '#fef2f2' : '#f8fafc'
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <Text style={{
                                        fontSize: 11, fontWeight: '600',
                                        color: isCurrent ? '#059669' : isDone ? (segResult?.passed ? '#059669' : '#dc2626') : '#94a3b8'
                                    }}>
                                        #{seg.id}{isCurrent ? ' — đang làm' : ''}
                                    </Text>
                                    {isDone && (
                                        <Text style={{
                                            fontSize: 11, fontWeight: '600',
                                            color: segResult?.passed ? '#059669' : '#dc2626'
                                        }}>
                                            {segResult?.accuracy?.toFixed(0)}%
                                        </Text>
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                                    {segWords.map((_: any, j: number) => (
                                        <View key={j} style={{
                                            width: 6, height: 6, borderRadius: 3,
                                            backgroundColor: isDone
                                                ? (segResult?.passed ? '#86efac' : '#fca5a5')
                                                : isCurrent ? '#6ee7b7' : '#e2e8f0'
                                        }} />
                                    ))}
                                </View>
                            </View>
                        );
                    })}

                    <Pressable
                        onPress={() => Alert.alert('Làm lại', 'Bạn muốn làm lại từ đầu?', [
                            { text: 'Huỷ', style: 'cancel' },
                            { text: 'Đồng ý', onPress: handleRestart }
                        ])}
                        style={{
                            marginTop: 6, paddingVertical: 9, borderRadius: 10,
                            borderWidth: 1, borderColor: '#e2e8f0',
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                    >
                        <Ionicons name="refresh" size={13} color="#64748b" />
                        <Text style={{ fontSize: 12, color: '#64748b' }}>Làm lại từ đầu</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* ── Bottom bar ── */}
            <View style={{
                paddingHorizontal: 14, paddingVertical: 12,
                borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff', gap: 8
            }}>
                {!checkResult ? (
                    <>
                        <Pressable
                            onPress={handleCheck}
                            disabled={checking || !userText.trim()}
                            style={{
                                paddingVertical: 14, borderRadius: 12, alignItems: 'center',
                                backgroundColor: checking || !userText.trim() ? '#e2e8f0' : '#059669'
                            }}
                        >
                            {checking
                                ? <ActivityIndicator color="#fff" size="small" />
                                : <Text style={{
                                    fontWeight: '600', fontSize: 15,
                                    color: !userText.trim() ? '#94a3b8' : '#fff'
                                }}>
                                    Kiểm tra đáp án
                                </Text>
                            }
                        </Pressable>
                        <Pressable
                            onPress={handleShowAnswer}
                            style={{
                                paddingVertical: 12, borderRadius: 12,
                                borderWidth: 1, borderColor: '#fca5a5',
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6
                            }}
                        >
                            <Ionicons name="eye-outline" size={15} color="#dc2626" />
                            <Text style={{ fontSize: 13, color: '#dc2626', fontWeight: '500' }}>
                                Hiện đáp án (tính 0 điểm đoạn này)
                            </Text>
                        </Pressable>
                    </>
                ) : (
                    <Pressable
                        onPress={handleNext}
                        style={{
                            paddingVertical: 14, borderRadius: 12, alignItems: 'center',
                            backgroundColor: '#0f172a',
                            flexDirection: 'row', justifyContent: 'center', gap: 8
                        }}
                    >
                        <Ionicons
                            name={currentSegIndex + 1 >= totalSegs ? 'trophy-outline' : 'chevron-forward'}
                            size={16} color="#fff"
                        />
                        <Text style={{ fontWeight: '600', fontSize: 15, color: '#fff' }}>
                            {currentSegIndex + 1 >= totalSegs ? 'Xem kết quả' : 'Đoạn tiếp theo'}
                        </Text>
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}
