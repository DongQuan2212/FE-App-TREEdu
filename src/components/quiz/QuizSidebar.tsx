import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuizQuestion, AnswerMap, FlagMap } from '../../types/quizTaking.types';

interface Props {
    title: string;
    attemptId: string;
    timeLeft: number;
    formatTime: (s: number) => string;
    progressPercent: number;
    answeredCount: number;
    questions: QuizQuestion[];
    currentIdx: number;
    answers: AnswerMap;
    flags: FlagMap;
    submitting: boolean;
    onJump: (idx: number) => void;
    onSubmit: () => void;
}

export default function QuizSidebar({
                                        title, attemptId,
                                        timeLeft, formatTime,
                                        progressPercent, answeredCount,
                                        questions, currentIdx,
                                        answers, flags,
                                        submitting,
                                        onJump, onSubmit,
                                    }: Props) {
    const isLowTime = timeLeft < 60;

    return (
        <View className="bg-white rounded-2xl border border-gray-200 p-5"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
        >
            {/* Title + ID */}
            <Text className="text-base font-bold text-gray-900 leading-tight mb-0.5" numberOfLines={2}>
                {title}
            </Text>
            <Text className="text-xs text-gray-400 mb-5">ID: #{attemptId.slice(-6)}</Text>

            {/* Timer */}
            <View
                className={`flex-row items-center justify-between px-4 py-3 rounded-xl mb-4 border-2 ${
                    isLowTime
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-100'
                }`}
            >
                <View>
                    <Text className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        isLowTime ? 'text-red-400' : 'text-gray-400'
                    }`}>
                        Thời gian còn lại
                    </Text>
                    <Text className={`text-2xl font-bold font-mono tracking-tight ${
                        isLowTime ? 'text-red-600' : 'text-gray-900'
                    }`}>
                        {formatTime(timeLeft)}
                    </Text>
                </View>
                <Ionicons
                    name="time-outline"
                    size={30}
                    color={isLowTime ? '#DC2626' : '#9CA3AF'}
                />
            </View>

            {/* Progress */}
            <View className="mb-5">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xs font-medium text-gray-500">
                        Tiến độ ({answeredCount}/{questions.length})
                    </Text>
                    <Text className="text-xs font-bold text-gray-900">{progressPercent}%</Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-[#22C55E] rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </View>
            </View>

            {/* Question grid */}
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-t border-gray-100 pt-4">
                Danh sách câu hỏi
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
                {questions.map((q, i) => {
                    const isCurrent  = i === currentIdx;
                    const isAnswered = !!answers[q.questionId];
                    const isFlagged  = flags[q.questionId];

                    let bgColor = '#F3F4F6';
                    let textColor = '#6B7280';
                    let borderColor = 'transparent';

                    if (isFlagged) {
                        bgColor = '#FEF9C3'; textColor = '#A16207'; borderColor = '#FDE68A';
                    } else if (isAnswered) {
                        bgColor = '#22C55E'; textColor = '#FFFFFF';
                    }

                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => onJump(i)}
                            style={{
                                width: 40, height: 40,
                                borderRadius: 8,
                                backgroundColor: bgColor,
                                borderWidth: isCurrent ? 2 : 1,
                                borderColor: isCurrent ? '#111111' : borderColor,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.75}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '700', color: textColor }}>
                                {i + 1}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Legend */}
            <View className="flex-row gap-4 mb-5">
                <View className="flex-row items-center gap-1.5">
                    <View className="w-3 h-3 rounded-sm bg-[#22C55E]" />
                    <Text className="text-[10px] text-gray-500">Đã trả lời</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <View className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-300" />
                    <Text className="text-[10px] text-gray-500">Đánh dấu</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <View className="w-3 h-3 rounded-sm bg-gray-200" />
                    <Text className="text-[10px] text-gray-500">Chưa làm</Text>
                </View>
            </View>

            {/* Submit button */}
            <TouchableOpacity
                onPress={onSubmit}
                disabled={submitting}
                className={`h-[52px] rounded-xl flex-row items-center justify-center gap-2 ${
                    submitting ? 'bg-gray-400' : 'bg-gray-900'
                }`}
                activeOpacity={0.85}
            >
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text className="text-base font-bold text-white">
                    {submitting ? 'Đang nộp...' : 'Nộp bài thi'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
