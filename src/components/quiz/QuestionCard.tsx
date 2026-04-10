import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuizQuestion, AnswerMap, FlagMap } from '../../types/quizTaking.types';

interface Props {
    question: QuizQuestion;
    index: number;
    total: number;
    answers: AnswerMap;
    flags: FlagMap;
    onSelect: (questionId: string, answerId: string) => void;
    onToggleFlag: (questionId: string) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function QuestionCard({
                                         question, index, total,
                                         answers, flags,
                                         onSelect, onToggleFlag,
                                         onNext, onPrev,
                                     }: Props) {
    const isFlagged   = flags[question.questionId];
    const isFirst     = index === 0;
    const isLast      = index === total - 1;

    return (
        <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
        >
            {/* ── Header ── */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-gray-600">
                        Câu hỏi {index + 1}/{total}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onToggleFlag(question.questionId)}
                    className="p-2 rounded-full"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons
                        name={isFlagged ? 'flag' : 'flag-outline'}
                        size={22}
                        color={isFlagged ? '#EAB308' : '#D1D5DB'}
                    />
                </TouchableOpacity>
            </View>

            {/* ── Question text ── */}
            <View className="px-5 pt-5 pb-4">
                <Text className="text-[16px] font-semibold text-gray-900 leading-7">
                    {question.content}
                </Text>
            </View>

            {/* ── Options ── */}
            <View className="px-5 pb-5 gap-3">
                {question.options.map(opt => {
                    const isSelected = answers[question.questionId] === opt.answerId;
                    return (
                        <TouchableOpacity
                            key={opt.answerId}
                            onPress={() => onSelect(question.questionId, opt.answerId)}
                            activeOpacity={0.75}
                            className={`flex-row items-center gap-3 p-4 rounded-xl border-2 ${
                                isSelected
                                    ? 'border-[#22C55E] bg-green-50'
                                    : 'border-gray-200 bg-white'
                            }`}
                        >
                            {/* Radio circle */}
                            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#22C55E] bg-[#22C55E]' : 'border-gray-300'
                            }`}>
                                {isSelected && (
                                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                                )}
                            </View>
                            <Text className={`text-sm font-medium flex-1 leading-5 ${
                                isSelected ? 'text-green-900' : 'text-gray-700'
                            }`}>
                                {opt.content}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ── Navigation buttons ── */}
            <View className="flex-row items-center justify-between px-5 py-4 border-t border-gray-100">
                <TouchableOpacity
                    onPress={onPrev}
                    disabled={isFirst}
                    className={`flex-row items-center gap-1 px-4 py-2 rounded-lg ${
                        isFirst ? 'opacity-30' : 'bg-gray-100'
                    }`}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={18} color="#374151" />
                    <Text className="text-sm font-semibold text-gray-700">Câu trước</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onNext}
                    disabled={isLast}
                    className={`flex-row items-center gap-1 px-4 py-2 rounded-lg ${
                        isLast ? 'opacity-30' : 'bg-gray-900'
                    }`}
                    activeOpacity={0.7}
                >
                    <Text className={`text-sm font-semibold ${isLast ? 'text-gray-400' : 'text-white'}`}>
                        Câu tiếp
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={isLast ? '#9CA3AF' : '#FFFFFF'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
