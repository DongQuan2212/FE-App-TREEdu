import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { QuizResult as QuizResultType } from '../../types/quizTaking.types';

interface Props {
    title: string;
    result: QuizResultType;
    onRetake: () => void;
    onBack: () => void;
}

export default function QuizResult({ title, result, onRetake, onBack }: Props) {
    const isPass = result.percentage >= 50;

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    className="bg-white rounded-2xl overflow-hidden mb-5 border border-gray-100"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}
                >
                    {/* Top section */}
                    <View className={`items-center pt-8 pb-6 px-6 ${isPass ? 'bg-green-50' : 'bg-red-50'}`}>
                        <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
                            isPass ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                            <Ionicons
                                name={isPass ? 'checkmark-circle' : 'close-circle'}
                                size={48}
                                color={isPass ? '#22C55E' : '#EF4444'}
                            />
                        </View>
                        <Text className="text-2xl font-extrabold text-gray-900 mb-1 text-center">
                            {isPass ? 'Làm bài tốt lắm! 🎉' : 'Cần cố gắng hơn!'}
                        </Text>
                        <Text className="text-sm text-gray-500 text-center">
                            Kết quả bài thi: <Text className="font-semibold">{title}</Text>
                        </Text>
                    </View>

                    {/* Score stats */}
                    <View className="flex-row items-center justify-center gap-0 py-6 border-t border-gray-100">
                        <View className="flex-1 items-center">
                            <Text className="text-3xl font-extrabold text-gray-900">
                                {result.score}/{result.totalQuestions}
                            </Text>
                            <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wide mt-1">
                                Câu đúng
                            </Text>
                        </View>
                        <View className="w-px h-12 bg-gray-200" />
                        <View className="flex-1 items-center">
                            <Text className={`text-3xl font-extrabold ${isPass ? 'text-green-600' : 'text-red-500'}`}>
                                {result.percentage}%
                            </Text>
                            <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wide mt-1">
                                Điểm số
                            </Text>
                        </View>
                    </View>

                    {/* Action buttons */}
                    <View className="flex-row gap-3 px-5 pb-5">
                        <TouchableOpacity
                            onPress={onBack}
                            className="flex-1 h-11 border border-gray-300 rounded-xl items-center justify-center"
                            activeOpacity={0.75}
                        >
                            <Text className="text-sm font-semibold text-gray-700">Về danh sách</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onRetake}
                            className="flex-1 h-11 bg-gray-900 rounded-xl flex-row items-center justify-center gap-1.5"
                            activeOpacity={0.85}
                        >
                            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
                            <Text className="text-sm font-bold text-white">Làm lại</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Detail results ── */}
                <Text className="text-base font-bold text-gray-900 mb-3 flex-row items-center">
                    Chi tiết bài làm
                </Text>

                <View style={{ gap: 12 }}>
                    {result.results.map((r, idx) => (
                        <View
                            key={idx}
                            className="bg-white rounded-xl border border-gray-200 p-4"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}
                        >
                            {/* Question */}
                            <View className="flex-row items-start gap-3 mb-3">
                                <Ionicons
                                    name={r.correct ? 'checkmark-circle' : 'close-circle'}
                                    size={22}
                                    color={r.correct ? '#22C55E' : '#EF4444'}
                                />
                                <Text className="text-sm font-semibold text-gray-900 flex-1 leading-5">
                                    <Text className="text-gray-400 font-medium">Câu {idx + 1}: </Text>
                                    {r.content}
                                </Text>
                            </View>

                            {/* Your answer */}
                            <View className={`p-3 rounded-lg flex-row items-start gap-2 mb-2 ${
                                r.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                            }`}>
                                <Text className={`text-xs font-bold shrink-0 mt-0.5 ${r.correct ? 'text-green-700' : 'text-red-700'}`}>
                                    Bạn chọn:
                                </Text>
                                <Text className={`text-xs flex-1 leading-4 ${r.correct ? 'text-green-800' : 'text-red-800'}`}>
                                    {r.selectedAnswer || 'Không trả lời'}
                                </Text>
                            </View>

                            {/* Correct answer */}
                            {!r.correct && (
                                <View className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex-row items-start gap-2 mb-2">
                                    <Text className="text-xs font-bold text-gray-600 shrink-0 mt-0.5">Đáp án đúng:</Text>
                                    <Text className="text-xs text-gray-700 flex-1 leading-4">{r.correctAnswer}</Text>
                                </View>
                            )}

                            {/* Explanation */}
                            {r.explanation && (
                                <View className="pl-3 border-l-2 border-gray-200 mt-1">
                                    <Text className="text-[11px] text-gray-400 italic leading-4">
                                        {r.explanation}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
