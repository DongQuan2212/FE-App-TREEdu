// src/components/quiz/QuizResult.tsx
import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons }     from '@expo/vector-icons';
import type { QuizResult as QuizResultType } from '../../types/quizTaking.types';

interface Props {
    title:    string;
    result:   QuizResultType;
    onRetake: () => void;
    onBack:   () => void;
}

export default function QuizResult({ title, result, onRetake, onBack }: Props) {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const pct    = Math.round(result.percentage);
    const passed = pct >= 60;

    const scoreColor = passed ? '#16A34A' : '#DC2626';
    const scoreBg    = passed ? '#DCFCE7' : '#FEE2E2';
    const badgeText  = passed ? '🎉 Đạt' : '💪 Chưa đạt';

    // Gamification — dùng optional chaining vì field mới, BE cũ có thể chưa trả
    const xpGained     = (result as any).xpGained     ?? 0;
    const currentLevel = (result as any).currentLevel ?? 1;
    const leveledUp    = (result as any).leveledUp    ?? false;

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
                        onPress={onBack}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center mr-3"
                    >
                        <Ionicons name="arrow-back" size={18} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-base font-bold text-gray-900 flex-1" numberOfLines={1}>
                        Kết quả bài thi
                    </Text>
                </View>

                {/* ── Score card ── */}
                <View
                    className="bg-white border border-gray-100 rounded-2xl p-5 mb-3 items-center"
                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
                >
                    <Text className="text-sm text-gray-400 mb-1 text-center" numberOfLines={2}>
                        {result.quizTitle || title}
                    </Text>

                    {/* Điểm tròn */}
                    <View
                        className="w-28 h-28 rounded-full items-center justify-center my-4 border-4"
                        style={{ backgroundColor: scoreBg, borderColor: passed ? '#BBF7D0' : '#FECDD3' }}
                    >
                        <Text className="text-3xl font-extrabold" style={{ color: scoreColor }}>
                            {pct}%
                        </Text>
                        <Text className="text-xs font-semibold mt-0.5" style={{ color: scoreColor }}>
                            {passed ? 'Đạt' : 'Chưa đạt'}
                        </Text>
                    </View>

                    {/* Badge */}
                    <View className="px-4 py-1.5 rounded-full mb-3" style={{ backgroundColor: scoreBg }}>
                        <Text className="text-sm font-bold" style={{ color: scoreColor }}>{badgeText}</Text>
                    </View>

                    {/* Số câu đúng */}
                    <Text className="text-gray-500 text-sm mb-4">
                        Đúng <Text className="font-bold text-gray-900">{result.score}</Text>
                        {' '}/ {result.totalQuestions} câu
                    </Text>

                    {/* ── Divider ── */}
                    <View className="w-full h-px bg-gray-100 mb-4" />

                    {/* ── Gamification: XP + Level ── */}
                    <View className="flex-row w-full">
                        {/* XP */}
                        <View className="flex-1 items-center py-3 bg-amber-50 rounded-2xl mr-2 border border-amber-100">
                            <View className="flex-row items-center gap-1 mb-1">
                                <Ionicons name="star" size={18} color="#F59E0B" />
                                <Text className="text-xl font-extrabold text-amber-500">
                                    +{xpGained}
                                </Text>
                            </View>
                            <Text className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
                                XP nhận được
                            </Text>
                        </View>

                        {/* Level */}
                        <View className="flex-1 items-center py-3 bg-blue-50 rounded-2xl ml-2 border border-blue-100">
                            <View className="flex-row items-center gap-1 mb-1">
                                <Ionicons name="shield-checkmark" size={18} color="#3B82F6" />
                                <Text className="text-xl font-extrabold text-blue-500">
                                    {currentLevel}
                                </Text>
                            </View>
                            <Text className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">
                                Cấp độ hiện tại
                            </Text>
                        </View>
                    </View>

                    {/* attemptId */}
                    {result.attemptId && (
                        <Text className="text-[10px] text-gray-300 mt-3">
                            #{result.attemptId.slice(0, 8).toUpperCase()}
                        </Text>
                    )}
                </View>

                {/* ── Level-up banner ── */}
                {leveledUp && (
                    <View
                        className="flex-row items-center justify-center gap-2 px-4 py-3.5 rounded-2xl mb-3 border border-yellow-300"
                        style={{ backgroundColor: '#FFFBEB' }}
                    >
                        <Ionicons name="flash" size={20} color="#D97706" />
                        <Text className="text-sm font-bold text-yellow-700">
                            🎊 Tuyệt vời! Bạn đã thăng lên Cấp {currentLevel}!
                        </Text>
                    </View>
                )}

                {/* ── Chi tiết câu hỏi ── */}
                <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Chi tiết từng câu
                </Text>

                {result.results.map((item, idx) => {
                    const expanded = expandedIdx === idx;
                    return (
                        <TouchableOpacity
                            key={item.questionId ?? idx}
                            className="bg-white border border-gray-100 rounded-2xl mb-2.5 overflow-hidden"
                            activeOpacity={0.80}
                            onPress={() => setExpandedIdx(expanded ? null : idx)}
                        >
                            {/* Accent bar */}
                            <View style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                backgroundColor: item.correct ? '#16A34A' : '#DC2626',
                                borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
                            }} />

                            {/* Row chính */}
                            <View className="flex-row items-start pl-5 pr-4 py-3.5 gap-3">
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
                                    <Text className="text-[11px] text-gray-400 mb-0.5">Câu {idx + 1}</Text>
                                    <Text
                                        className="text-sm font-semibold text-gray-900 leading-5"
                                        numberOfLines={expanded ? undefined : 2}
                                    >
                                        {item.content}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={expanded ? 'chevron-up' : 'chevron-down'}
                                    size={16} color="#D1D5DB"
                                />
                            </View>

                            {/* Expanded */}
                            {expanded && (
                                <View className="pl-5 pr-4 pb-4 gap-2 border-t border-gray-50">
                                    <View className="mt-3">
                                        <Text className="text-[11px] text-gray-400 mb-1">Bạn chọn</Text>
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

                                    {!item.correct && (
                                        <View>
                                            <Text className="text-[11px] text-gray-400 mb-1">Đáp án đúng</Text>
                                            <View className="flex-row items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 border border-green-100">
                                                <Ionicons name="checkmark-circle" size={15} color="#16A34A" />
                                                <Text className="text-sm text-green-700 flex-1">
                                                    {item.correctAnswer}
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {item.explanation && (
                                        <View className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                                            <Text className="text-[11px] font-semibold text-blue-400 mb-1">
                                                💡 Giải thích
                                            </Text>
                                            <Text className="text-sm text-blue-700 leading-5">
                                                {item.explanation}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* ── Actions ── */}
                <View className="flex-row gap-3 mt-4">
                    <TouchableOpacity
                        className="flex-1 h-[50px] border border-gray-200 bg-white rounded-2xl items-center justify-center"
                        activeOpacity={0.80}
                        onPress={onBack}
                    >
                        <Text className="text-sm font-bold text-gray-700">← Quay lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 h-[50px] bg-[#22C55E] rounded-2xl items-center justify-center"
                        activeOpacity={0.85}
                        onPress={onRetake}
                    >
                        <Text className="text-sm font-bold text-white">Làm lại 🔁</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
