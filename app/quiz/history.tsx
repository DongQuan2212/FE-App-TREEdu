// app/quiz/history.tsx
// Màn hình: Lịch sử làm bài — danh sách tất cả các lần làm quiz

import React, { useMemo } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    ActivityIndicator, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Stack, useRouter} from 'expo-router';
import { Ionicons }     from '@expo/vector-icons';
import { useMyAttempts } from '../../src/hooks/useQuizHistory';
import type { QuizAttemptSummary } from '../../src/types/quizHistory.types';

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('vi-VN', {
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

function scoreLabel(pct: number) {
    if (pct >= 80) return '🎉 Xuất sắc';
    if (pct >= 60) return '✅ Đạt';
    return           '💪 Chưa đạt';
}

// ── Component: 1 dòng attempt ────────────────────────────────────────────────
function AttemptCard({ item, onPress }: { item: QuizAttemptSummary; onPress: () => void }) {
    const pct    = Math.round(item.percentage);
    const colors = scoreColor(pct);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.78}
            className="bg-white border border-gray-100 rounded-2xl mx-4 mb-3 overflow-hidden"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}
        >
            <Stack.Screen options={{ headerShown: false }} />
            {/* Top bar — màu theo điểm */}
            <View style={{ height: 3, backgroundColor: colors.text }} />


            <View className="px-4 py-3.5">
                {/* Quiz title + mũi tên */}
                <View className="flex-row items-start justify-between mb-2">
                    <Text
                        className="text-sm font-bold text-gray-900 flex-1 pr-2 leading-5"
                        numberOfLines={2}
                    >
                        {item.quizTitle}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>

                {/* Row dưới: điểm + ngày */}
                <View className="flex-row items-center justify-between">
                    {/* Score badge */}
                    <View className="flex-row items-center gap-2">
                        <View
                            className="px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
                        >
                            <Text className="text-xs font-bold" style={{ color: colors.text }}>
                                {pct}%
                            </Text>
                        </View>

                        <Text className="text-xs text-gray-400">
                            {item.score}/{item.totalQuestions} câu đúng
                        </Text>
                    </View>

                    {/* Ngày làm */}
                    <Text className="text-[11px] text-gray-300">
                        {formatDate(item.submittedAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ── Màn hình chính ───────────────────────────────────────────────────────────
export default function QuizHistoryScreen() {
    const router = useRouter();
    const { attempts, loading, refresh } = useMyAttempts();

    // Thống kê nhanh
    const stats = useMemo(() => {
        if (!attempts.length) return null;
        const total    = attempts.length;
        const avgPct   = Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / total);
        const bestPct  = Math.round(Math.max(...attempts.map(a => a.percentage)));
        const passed   = attempts.filter(a => a.percentage >= 60).length;
        return { total, avgPct, bestPct, passed };
    }, [attempts]);

    // ── Loading state ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color="#22C55E" />
                <Text className="text-sm text-gray-400 mt-3">Đang tải lịch sử...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <FlatList
                data={attempts}
                keyExtractor={a => a.attemptId}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refresh}
                        tintColor="#22C55E"
                    />
                }
                ListHeaderComponent={() => (
                    <>
                        {/* ── Header ── */}
                        <View className="flex-row items-center px-4 pt-4 pb-3">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center mr-3"
                            >
                                <Ionicons name="arrow-back" size={18} color="#374151" />
                            </TouchableOpacity>
                            <View className="flex-1">
                                <Text className="text-base font-bold text-gray-900">Lịch sử làm bài</Text>
                                <Text className="text-xs text-gray-400">{attempts.length} lần làm bài</Text>
                            </View>
                        </View>

                        {/* ── Stats card ── */}
                        {stats && (
                            <View className="mx-4 mb-4 bg-white border border-gray-100 rounded-2xl p-4">
                                <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                    Tổng quan
                                </Text>
                                <View className="flex-row justify-between">
                                    {/* Tổng số lần */}
                                    <View className="items-center flex-1">
                                        <Text className="text-2xl font-extrabold text-gray-900">{stats.total}</Text>
                                        <Text className="text-[11px] text-gray-400 mt-0.5">Lần làm</Text>
                                    </View>

                                    <View className="w-px bg-gray-100" />

                                    {/* Điểm TB */}
                                    <View className="items-center flex-1">
                                        <Text className="text-2xl font-extrabold text-[#22C55E]">{stats.avgPct}%</Text>
                                        <Text className="text-[11px] text-gray-400 mt-0.5">Điểm TB</Text>
                                    </View>

                                    <View className="w-px bg-gray-100" />

                                    {/* Điểm cao nhất */}
                                    <View className="items-center flex-1">
                                        <Text className="text-2xl font-extrabold text-[#F59E0B]">{stats.bestPct}%</Text>
                                        <Text className="text-[11px] text-gray-400 mt-0.5">Cao nhất</Text>
                                    </View>

                                    <View className="w-px bg-gray-100" />

                                    {/* Số lần đạt */}
                                    <View className="items-center flex-1">
                                        <Text className="text-2xl font-extrabold text-[#6366F1]">{stats.passed}</Text>
                                        <Text className="text-[11px] text-gray-400 mt-0.5">Lần đạt</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* ── Section label ── */}
                        {attempts.length > 0 && (
                            <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 mx-5">
                                Tất cả các lần làm
                            </Text>
                        )}
                    </>
                )}
                renderItem={({ item }) => (
                    <AttemptCard
                        item={item}
                        onPress={() => router.push(`/quiz/attempt/${item.attemptId}`)}
                    />
                )}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center pt-16 px-8">
                        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                            <Ionicons name="document-text-outline" size={28} color="#D1D5DB" />
                        </View>
                        <Text className="text-base font-bold text-gray-700 mb-1">Chưa có lịch sử</Text>
                        <Text className="text-sm text-gray-400 text-center leading-5">
                            Bạn chưa làm bài quiz nào. Hãy thử làm một bài ngay!
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/quiz' as any)}
                            className="mt-5 px-6 py-3 bg-[#22C55E] rounded-2xl"
                        >
                            <Text className="text-sm font-bold text-white">Khám phá Quiz →</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 32 }}
            />
        </SafeAreaView>
    );
}
