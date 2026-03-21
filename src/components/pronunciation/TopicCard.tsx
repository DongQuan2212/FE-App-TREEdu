import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Topic } from '../../types/pronunciation.types';
import { LEVEL_CONFIG } from '../../constants/pronunciation.constants';

interface Props {
    topic: Topic;
    onPress: (name: string) => void;
}

export default function TopicCard({ topic, onPress }: Props) {
    const lv = LEVEL_CONFIG[topic.level] ?? LEVEL_CONFIG[1];

    return (
        <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => onPress(topic.name)}
            className="w-[48%] bg-white border border-gray-200 rounded-[18px] overflow-hidden mb-3"
        >
            {/* ── Icon area ── */}
            <View
                className="h-[110px] items-center justify-center relative"
                style={{ backgroundColor: lv.areaBg }}
            >
                {/* Level badge */}
                <View
                    className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full border"
                    style={{ backgroundColor: lv.bg, borderColor: lv.border }}
                >
                    <Text
                        className="text-[10px] font-extrabold tracking-wide"
                        style={{ color: lv.text }}
                    >
                        LV {topic.level}
                    </Text>
                </View>

                {/* Icon circle */}
                <View className="w-14 h-14 rounded-full bg-white items-center justify-center shadow-sm">
                    <Ionicons
                        name={topic.icon as any}
                        size={28}
                        color={lv.iconColor}
                    />
                </View>

                {/* Mic chip */}
                <View className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full bg-purple-50 border border-purple-200 items-center justify-center">
                    <Ionicons name="mic" size={11} color="#A855F7" />
                </View>
            </View>

            {/* ── Content ── */}
            <View className="p-3.5 border-t border-gray-50">
                <Text className="text-sm font-bold text-gray-900 text-center mb-1.5" numberOfLines={1}>
                    {topic.name}
                </Text>
                <Text className="text-[11px] text-gray-500 text-center leading-4 mb-3.5 min-h-[48px]" numberOfLines={3}>
                    {topic.description}
                </Text>

                {/* CTA button */}
                <TouchableOpacity
                    className="flex-row items-center justify-center gap-1 h-9 bg-gray-900 rounded-[10px]"
                    activeOpacity={0.85}
                    onPress={() => onPress(topic.name)}
                >
                    <Text className="text-xs font-bold text-white">Bắt đầu</Text>
                    <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
