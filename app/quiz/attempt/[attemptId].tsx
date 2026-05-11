// app/quiz/attempt/[attemptId].tsx
// Màn hình: Chi tiết 1 lần làm bài quiz

import React, { useState, useMemo } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    ActivityIndicator, StatusBar,
} from 'react-native';
import { SafeAreaView }           from 'react-native-safe-area-context';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import { Ionicons }               from '@expo/vector-icons';
import { useAttemptDetail }       from '../../../src/hooks/useQuizHistory';
import type { QuestionResult }    from '../../../src/types/quizHistory.types';

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('vi-VN', {
            weekday: 'long',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

function scoreColor(pct: number) {
    if (pct >= 80) return { text: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0' };
    if (pct >= 60) return { text: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
    return           { text: '#DC2626', bg: '#FEE2E2', border: '#FECDD3' };
}

// ── Component: 1 câu hỏi có expand ──────────────────────────────────────────
function QuestionResultCard({
                                item, index, expanded, onToggle,
                            }: {
    item:     QuestionResult;
    index:    number;
    expanded: boolean;
    onToggle: () => void;
}) {
    return (

        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.80}
            className="bg-white border border-gray-100 rounded-2xl mb-2.5 overflow-hidden"
        >
            {/* Left accent bar */}
            <View
                style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                    backgroundColor: item.correct ? '#16A34A' : '#DC2626',
                    borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
                }}
            />
            <Stack.Screen options={{ headerShown: false }} />
            {/* Main row */}
            <View className="flex-row items-start pl-5 pr-4 py-3.5 gap-3">
                {/* Icon */}
                <View
                    className="w-7 h-7 rounded-full items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: item.correct ? '#DCFCE7' : '#FEE2E2' }}
                >
                    <Ionicons
                        name={item.correct ? 'checkmark' : 'close'}
                        size={14}
                        color={item.correct ? '#16A34A' : '#DC2626'}
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-[11px] text-gray-400 mb-0.5">Câu {index + 1}</Text>
                    <Text className="text-sm font-semibold text-gray-900 leading-5" numberOfLines={expanded ? undefined : 2}>
                        {item.content}
                    </Text>
                </View>

                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#D1D5DB"
                />
            </View>

            {/* Expanded detail */}
            {expanded && (
                <View className="pl-5 pr-4 pb-4 gap-2 border-t border-gray-50">
                    {/* Đáp án user chọn */}
                    <View className="mt-3">
                        <Text className="text-[11px] text-gray-400 mb-1">Bạn đã chọn</Text>
                        <View
                            className="flex-row items-center gap-2 px-3 py-2.5 rounded-xl"
                            style={{
                                backgroundColor: item.correct ? '#F0FDF4' : '#FFF1F2',
                                borderWidth: 1,
                                borderColor: item.correct ? '#BBF7D0' : '#FECDD3',
                            }}
                        >
                            <Ionicons
                                name={item.correct ? 'checkmark-circle' : 'close-circle'}
                                size={15}
                                color={item.correct ? '#16A34A' : '#DC2626'}
                            />
                            <Text
                                className="text-sm flex-1"
                                style={{ color: item.correct ? '#15803D' : '#BE123C' }}
                            >
                                {item.selectedAnswer || 'Không trả lời'}
                            </Text>
                        </View>
                    </View>

                    {/* Đáp án đúng — chỉ hiện khi sai */}
                    {!item.correct && (
                        <View>
                            <Text className="text-[11px] text-gray-400 mb-1">Đáp án đúng</Text>
                            <View className="flex-row items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 border border-green-100">
                                <Ionicons name="checkmark-circle" size={15} color="#16A34A" />
                                <Text className="text-sm text-green-700 flex-1">{item.correctAnswer}</Text>
                            </View>
                        </View>
                    )}

                    {/* Giải thích */}
                    {item.explanation && (
                        <View className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                            <Text className="text-[11px] font-semibold text-blue-400 mb-1">💡 Giải thích</Text>
                            <Text className="text-sm text-blue-700 leading-5">{item.explanation}</Text>
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

// ── Màn hình chính ───────────────────────────────────────────────────────────
export default function AttemptDetailScreen() {
    const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
    const router        = useRouter();
    const { attempt, loading, error } = useAttemptDetail(attemptId ?? '');
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    // ── Loading ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color="#22C55E" />
                <Text className="text-sm text-gray-400 mt-3">Đang tải chi tiết...</Text>
            </SafeAreaView>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────
    if (error || !attempt) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
                <StatusBar barStyle="dark-content" />
                <Ionicons name="alert-circle-outline" size={40} color="#FCA5A5" />
                <Text className="text-base font-bold text-gray-700 mt-3 mb-1">Không tải được</Text>
                <Text className="text-sm text-gray-400 text-center">{error}</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-5 px-6 py-3 bg-gray-100 rounded-2xl">
                    <Text className="text-sm font-bold text-gray-700">← Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const pct     = Math.round(attempt.percentage);
    const colors  = scoreColor(pct);
    const passed  = pct >= 60;
    const results = attempt.results ?? [];

    // Thống kê câu đúng/sai
    const correctCount   = results.filter(r => r.correct).length;
    const incorrectCount = results.length - correctCount;

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center mr-3"
                    >
                        <Ionicons name="arrow-back" size={18} color="#374151" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900">Chi tiết bài làm</Text>
                        <Text className="text-[11px] text-gray-400 mt-0.5" numberOfLines={1}>
                            #{attempt.attemptId.slice(0, 8).toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* ── Score card ── */}
                <View className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 items-center"
                      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
                >
                    <Text className="text-sm text-gray-500 font-medium text-center mb-4" numberOfLines={2}>
                        {attempt.quizTitle}
                    </Text>

                    {/* Vòng tròn điểm */}
                    <View
                        className="w-28 h-28 rounded-full items-center justify-center mb-3"
                        style={{ backgroundColor: colors.bg, borderWidth: 3, borderColor: colors.border }}
                    >
                        <Text className="text-3xl font-extrabold" style={{ color: colors.text }}>
                            {pct}%
                        </Text>
                        <Text className="text-[11px] font-medium" style={{ color: colors.text }}>
                            {passed ? 'Đạt' : 'Chưa đạt'}
                        </Text>
                    </View>

                    {/* Thống kê nhanh */}
                    <View className="flex-row gap-4 mt-1">
                        <View className="items-center bg-green-50 rounded-xl px-4 py-2.5 flex-1">
                            <Text className="text-xl font-extrabold text-green-600">{correctCount}</Text>
                            <Text className="text-[11px] text-green-500">Đúng</Text>
                        </View>
                        <View className="items-center bg-red-50 rounded-xl px-4 py-2.5 flex-1">
                            <Text className="text-xl font-extrabold text-red-500">{incorrectCount}</Text>
                            <Text className="text-[11px] text-red-400">Sai</Text>
                        </View>
                        <View className="items-center bg-gray-50 rounded-xl px-4 py-2.5 flex-1">
                            <Text className="text-xl font-extrabold text-gray-700">{results.length}</Text>
                            <Text className="text-[11px] text-gray-400">Tổng câu</Text>
                        </View>
                    </View>

                    {/* Ngày làm */}
                    <Text className="text-[11px] text-gray-300 mt-3">
                        {formatDate(attempt.submittedAt)}
                    </Text>
                </View>

                {/* ── Danh sách câu hỏi ── */}
                {results.length > 0 ? (
                    <>
                        {/* Filter tabs (đúng/sai/tất cả) */}
                        <FilterTabs
                            results={results}
                            expandedIdx={expandedIdx}
                            onToggle={(i) => setExpandedIdx(expandedIdx === i ? null : i)}
                        />
                    </>
                ) : (
                    <View className="items-center py-8">
                        <Text className="text-sm text-gray-400">Không có chi tiết câu hỏi.</Text>
                    </View>
                )}

                {/* ── Action ── */}
                <View className="flex-row gap-3 mt-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 h-[50px] border border-gray-200 bg-white rounded-2xl items-center justify-center"
                        activeOpacity={0.80}
                    >
                        <Text className="text-sm font-bold text-gray-700">← Quay lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push(`/quiz/${attempt.attemptId}`)}
                        className="flex-1 h-[50px] bg-[#22C55E] rounded-2xl items-center justify-center"
                        activeOpacity={0.85}
                    >
                        <Text className="text-sm font-bold text-white">Làm lại 🔁</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ── Sub-component: filter + list câu hỏi ─────────────────────────────────────
type FilterType = 'all' | 'correct' | 'incorrect';

function FilterTabs({
                        results, expandedIdx, onToggle,
                    }: {
    results:     QuestionResult[];
    expandedIdx: number | null;
    onToggle:    (i: number) => void;
}) {
    const [filter, setFilter] = useState<FilterType>('all');

    const filtered = useMemo(() => {
        if (filter === 'correct')   return results.map((r, i) => ({ r, i })).filter(({ r }) => r.correct);
        if (filter === 'incorrect') return results.map((r, i) => ({ r, i })).filter(({ r }) => !r.correct);
        return results.map((r, i) => ({ r, i }));
    }, [filter, results]);

    const tabs: { key: FilterType; label: string; count: number }[] = [
        { key: 'all',       label: 'Tất cả',    count: results.length },
        { key: 'correct',   label: '✅ Đúng',   count: results.filter(r => r.correct).length },
        { key: 'incorrect', label: '❌ Sai',    count: results.filter(r => !r.correct).length },
    ];

    return (
        <>
            {/* Tabs */}
            <View className="flex-row gap-2 mb-3">
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setFilter(tab.key)}
                        className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-full"
                        style={{
                            backgroundColor: filter === tab.key ? '#22C55E' : '#F3F4F6',
                        }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: filter === tab.key ? '#fff' : '#6B7280' }}
                        >
                            {tab.label}
                        </Text>
                        <View
                            className="w-4 h-4 rounded-full items-center justify-center"
                            style={{ backgroundColor: filter === tab.key ? 'rgba(255,255,255,0.25)' : '#E5E7EB' }}
                        >
                            <Text
                                className="text-[10px] font-bold"
                                style={{ color: filter === tab.key ? '#fff' : '#9CA3AF' }}
                            >
                                {tab.count}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List câu hỏi */}
            {filtered.map(({ r, i }) => (
                <QuestionResultCard
                    key={r.questionId ?? i}
                    item={r}
                    index={i}
                    expanded={expandedIdx === i}
                    onToggle={() => onToggle(i)}
                />
            ))}
        </>
    );
}
