import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Flashcard } from '../../types/flashcard';
import { LEVEL_CONFIG, TYPE_CONFIG } from '../../constants/flashcard.constants';

interface Props {
    card:      Flashcard;
    onPress:   (id: string) => void;
    onReport?: (card: Flashcard) => void;
}

export default function FlashcardCard({ card, onPress, onReport }: Props) {
    const lv       = LEVEL_CONFIG[card.level] ?? { bg: '#F4F4F5', text: '#71717A' };
    const type     = TYPE_CONFIG[card.type]   ?? TYPE_CONFIG['BY_MEMBER'];
    const isPublic = card.visibility === 'PUBLIC';
    const isOwner  = card.isOwner === true;
    const isViolated = card.isViolated === true;

    return (
        <TouchableOpacity
            className="w-[48%] bg-white border border-gray-200 rounded-2xl p-4 mb-3"
            activeOpacity={0.80}
            onPress={() => onPress(card.id)}
            style={{ overflow: 'visible' }}
        >
            {/* ── Violated overlay ── */}
            {isViolated && (
                <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(254,242,242,0.92)',
                    borderRadius: 16, zIndex: 5,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ionicons name="warning-outline" size={22} color="#DC2626" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#DC2626', marginTop: 4, textAlign: 'center' }}>
                        Vi phạm nội dung
                    </Text>
                </View>
            )}

            {/* ── Shared badge (BY_MEMBER của người khác) ── */}
            {!isOwner && card.type === 'BY_MEMBER' && (
                <View style={{
                    position: 'absolute', top: -8, right: -8, zIndex: 10,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1, borderColor: '#E5E7EB',
                    borderRadius: 999,
                    flexDirection: 'row', alignItems: 'center',
                    paddingHorizontal: 6, paddingVertical: 3,
                    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
                }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 3 }} />
                    <Text style={{ fontSize: 9, fontWeight: '600', color: '#6B7280' }}>Shared</Text>
                </View>
            )}

            {/* ── Top: type + visibility + level ── */}
            <View className="flex-row justify-between items-center mb-2.5">
                <View className="px-2 py-[3px] rounded-md" style={{ backgroundColor: type.bg }}>
                    <Text className="text-[10px] font-bold tracking-wide" style={{ color: type.text }}>
                        {type.label}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <Ionicons
                        name={isPublic ? 'globe-outline' : 'lock-closed-outline'}
                        size={13}
                        color={isPublic ? '#60A5FA' : '#F59E0B'}
                    />
                    <View className="px-2 py-[3px] rounded-md" style={{ backgroundColor: lv.bg }}>
                        <Text className="text-[10px] font-extrabold tracking-wide" style={{ color: lv.text }}>
                            LV {card.level}
                        </Text>
                    </View>
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
                <View className="flex-row items-center gap-2">
                    {/* Report — chỉ hiện khi không phải owner và không bị violated */}
                    {!isOwner && !isViolated && onReport && (
                        <TouchableOpacity
                            onPress={() => onReport(card)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="flag-outline" size={14} color="#D1D5DB" />
                        </TouchableOpacity>
                    )}
                    <View className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center">
                        <Ionicons name="arrow-forward" size={13} color="#6B7280" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
