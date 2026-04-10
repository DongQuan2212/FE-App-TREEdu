import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quiz } from '../../types/quiz';
import { LEVEL_CONFIG } from '../../constants/quiz.constants';

interface Props {
    quiz: Quiz;
    onPress: (id: string) => void;
}

export default function QuizCard({ quiz, onPress }: Props) {
    const lv = LEVEL_CONFIG[quiz.level] ?? { bg: '#F4F4F5', text: '#71717A' };

    return (
        <TouchableOpacity
            className="bg-white border border-gray-200 rounded-2xl p-[18px] mb-2.5"
            activeOpacity={0.80}
            onPress={() => onPress(quiz.id)}
        >
            {/* ── Top row: topic + level ── */}
            <View className="flex-row justify-between items-center mb-2.5">
                <View className="flex-row items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md max-w-[55%]">
                    <Ionicons name="pricetag-outline" size={11} color="#6B7280" />
                    <Text className="text-[11px] text-gray-500 font-medium" numberOfLines={1}>
                        {quiz.topic}
                    </Text>
                </View>

                <View
                    className="px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: lv.bg }}
                >
                    <Text
                        className="text-[11px] font-extrabold tracking-wide"
                        style={{ color: lv.text }}
                    >
                        LV {quiz.level}
                    </Text>
                </View>
            </View>

            {/* ── Title ── */}
            <Text className="text-base font-bold text-gray-900 leading-6 mb-2.5" numberOfLines={2}>
                {quiz.title}
            </Text>

            {/* ── Meta: câu hỏi + thời gian ── */}
            <View className="flex-row items-center gap-2 mb-3.5">
                <View className="flex-row items-center gap-1">
                    <Ionicons name="help-circle-outline" size={13} color="#9CA3AF" />
                    <Text className="text-xs text-gray-400 font-medium">{quiz.questionCount} câu</Text>
                </View>
                <View className="w-[3px] h-[3px] rounded-full bg-gray-300" />
                <View className="flex-row items-center gap-1">
                    <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                    <Text className="text-xs text-gray-400 font-medium">{quiz.timer} phút</Text>
                </View>
            </View>

            {/* ── Footer ── */}
            <View className="flex-row justify-between items-center border-t border-gray-50 pt-3">
                <Text className="text-xs font-semibold text-gray-400">Kiểm tra ngay</Text>
                <View className="w-[30px] h-[30px] rounded-full bg-gray-100 items-center justify-center">
                    <Ionicons name="arrow-forward" size={14} color="#6B7280" />
                </View>
            </View>
        </TouchableOpacity>
    );
}
