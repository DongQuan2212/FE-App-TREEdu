import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Flashcard } from '../../types/flashcard';
import { LEVEL_CONFIG, TYPE_CONFIG } from '../../constants/flashcard.constants';

interface Props {
    card: Flashcard;
    onPress: (id: string) => void;
}

export default function FlashcardCard({ card, onPress }: Props) {
    const lv   = LEVEL_CONFIG[card.level] ?? { bg: '#F4F4F5', text: '#71717A' };
    const type = TYPE_CONFIG[card.type]   ?? TYPE_CONFIG['BY_MEMBER'];

    return (
        <TouchableOpacity
            className="w-[48%] bg-white border border-gray-200 rounded-2xl p-4 mb-3"
            activeOpacity={0.80}
            onPress={() => onPress(card.id)}
        >
            {/* ── Top: type + level badges ── */}
            <View className="flex-row justify-between items-center mb-2.5">
                <View className="px-2 py-[3px] rounded-md" style={{ backgroundColor: type.bg }}>
                    <Text className="text-[10px] font-bold tracking-wide" style={{ color: type.text }}>
                        {type.label}
                    </Text>
                </View>
                <View className="px-2 py-[3px] rounded-md" style={{ backgroundColor: lv.bg }}>
                    <Text className="text-[10px] font-extrabold tracking-wide" style={{ color: lv.text }}>
                        LV {card.level}
                    </Text>
                </View>
            </View>

            {/* ── Title ── */}
            <Text className="text-sm font-bold text-gray-900 leading-5 mb-1" numberOfLines={2}>
                {card.title}
            </Text>

            {/* ── Topic ── */}
            {card.topic ? (
                <Text className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5" numberOfLines={1}>
                    {card.topic}
                </Text>
            ) : null}

            {/* ── Description ── */}
            <Text className="text-[11px] text-gray-500 leading-4 mb-3.5 flex-1" numberOfLines={2}>
                {card.description ?? 'Chưa có mô tả'}
            </Text>

            {/* ── Footer ── */}
            <View className="flex-row justify-between items-center border-t border-gray-50 pt-2.5">
                <View className="flex-row items-center gap-1">
                    <Ionicons name="book-outline" size={12} color="#9CA3AF" />
                    <Text className="text-[11px] text-gray-400 font-medium">{card.wordCount} từ</Text>
                </View>
                <View className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center">
                    <Ionicons name="arrow-forward" size={13} color="#6B7280" />
                </View>
            </View>
        </TouchableOpacity>
    );
}
