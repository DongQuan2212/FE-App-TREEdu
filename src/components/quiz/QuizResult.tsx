// src/components/quiz/QuizResult.tsx
//
// Nhận QuizAttemptResponse từ BE (sau khi submit thật).
// Shape: { attemptId, quizTitle, score, totalQuestions, percentage, results[], submittedAt }
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StatusBar,
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

    const pct     = Math.round(result.percentage);
    const passed  = pct >= 60;

    // ── Màu theo kết quả ────────────────────────────────────────────────────
    const scoreColor  = passed ? '#16A34A' : '#DC2626';
    const scoreBg     = passed ? '#DCFCE7' : '#FEE2E2';
    const badgeText   = passed ? '🎉 Đạt' : '💪 Chưa đạt';

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
                <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 items-center">
                    <Text className="text-sm text-gray-400 mb-1" numberOfLines={2}>
                        {result.quizTitle || title}
                    </Text>

                    {/* Điểm tròn */}
                    <View
                        className="w-24 h-24 rounded-full items-center justify-center my-4"
                        style={{ backgroundColor: scoreBg }}
                    >
                        <Text className="text-3xl font-extrabold" style={{ color: scoreColor }}>
                            {pct}%
                        </Text>
                    </View>

                    {/* Badge đạt / chưa đạt */}
                    <View
                        className="px-4 py-1.5 rounded-full mb-3"
                        style={{ backgroundColor: scoreBg }}
                    >
                        <Text className="text-sm font-bold" style={{ color: scoreColor }}>
                            {badgeText}
                        </Text>
                    </View>

                    {/* Số câu đúng */}
                    <Text className="text-gray-500 text-sm">
                        Đúng{' '}
                        <Text className="font-bold text-gray-900">{result.score}</Text>
                        {' '}/ {result.totalQuestions} câu
                    </Text>

                    {/* attemptId nhỏ ở dưới */}
                    {result.attemptId && (
                        <Text className="text-[10px] text-gray-300 mt-2">
                            #{result.attemptId.slice(0, 8).toUpperCase()}
                        </Text>
                    )}
                </View>

                {/* ── Danh sách câu hỏi + đáp án ── */}
                <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Chi tiết từng câu
                </Text>

                {result.results.map((item, idx) => {
                    const expanded = expandedIdx === idx;
                    return (
                        <TouchableOpacity
                            key={item.questionId ?? idx}
                            className="bg-white border border-gray-200 rounded-2xl mb-2.5 overflow-hidden"
                            activeOpacity={0.80}
                            onPress={() => setExpandedIdx(expanded ? null : idx)}
                        >
                            {/* ── Row chính ── */}
                            <View className="flex-row items-start px-4 py-3.5 gap-3">
                                {/* Icon đúng/sai */}
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
                                    {/* Số thứ tự + nội dung câu hỏi */}
                                    <Text className="text-[11px] text-gray-400 mb-0.5">
                                        Câu {idx + 1}
                                    </Text>
                                    <Text className="text-sm font-semibold text-gray-900 leading-5">
                                        {item.content}
                                    </Text>
                                </View>

                                <Ionicons
                                    name={expanded ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color="#D1D5DB"
                                />
                            </View>

                            {/* ── Expanded: đáp án ── */}
                            {expanded && (
                                <View className="px-4 pb-4 gap-2 border-t border-gray-50">
                                    {/* Đáp án user chọn */}
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

                                    {/* Đáp án đúng (chỉ hiện khi sai) */}
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

                                    {/* Giải thích (nếu BE trả về) */}
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
