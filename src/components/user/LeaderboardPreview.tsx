// src/components/user/LeaderboardPreview.tsx
import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LeaderboardEntry } from '@/src/hooks/useLeaderboard';

const C = {
    brand:   '#5A8A2E',
    brandDark: '#3B6D11',
    text:    '#111111',
    muted:   '#9CA3AF',
    surface: '#FFFFFF',
    bg:      '#F8FAF5',
    amber:   '#D97706',
    amberLight: '#FFF7ED',
    gold:    '#F59E0B',
    silver:  '#9CA3AF',
    bronze:  '#B45309',
} as const;

interface Props {
    data: LeaderboardEntry[];
    loading: boolean;
}

const MEDAL_COLORS = [C.gold, C.silver, C.bronze];
const MEDAL_BG     = ['#FEF9C3', '#F3F4F6', '#FEF3C7'];
const RANK_EMOJIS  = ['🥇', '🥈', '🥉'];

export default function LeaderboardPreview({ data, loading }: Props) {
    const router = useRouter();
    const top3   = data.slice(0, 3);

    if (loading) {
        return (
            <View style={s.loadingWrap}>
                <ActivityIndicator color={C.brand} />
            </View>
        );
    }

    if (top3.length === 0) return null;

    return (
        <View style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <View style={s.titleRow}>
                    <Text style={s.titleIcon}>🏆</Text>
                    <Text style={s.title}>BẢNG XẾP HẠNG</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/tabs/leaderboard' as any)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text style={s.seeAll}>Xem tất cả →</Text>
                </TouchableOpacity>
            </View>

            {/* Card */}
            <View style={s.card}>
                {top3.map((item, index) => (
                    <View
                        key={item.userId}
                        style={[
                            s.entry,
                            index === 0 && s.firstEntry,
                            index !== top3.length - 1 && s.border,
                        ]}
                    >
                        {/* Rank */}
                        <View style={[s.rankBox, { backgroundColor: MEDAL_BG[index] }]}>
                            <Text style={s.medal}>{RANK_EMOJIS[index]}</Text>
                        </View>

                        {/* Name + level */}
                        <View style={s.info}>
                            <Text style={s.name} numberOfLines={1}>
                                {item.displayName}
                            </Text>
                            <Text style={s.level}>Cấp độ {item.level}</Text>
                        </View>

                        {/* XP value */}
                        <View style={s.valueBox}>
                            <Text style={[s.value, { color: MEDAL_COLORS[index] }]}>
                                {item.value.toLocaleString('vi-VN')}
                            </Text>
                            <Text style={s.unit}>XP</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    loadingWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    container: {
        marginTop: 8,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    titleIcon: { fontSize: 14 },
    title: {
        fontSize: 11,
        fontWeight: '600',
        color: C.muted,
        letterSpacing: 0.8,
    },
    seeAll: {
        fontSize: 12,
        color: C.brand,
        fontWeight: '700',
    },
    card: {
        backgroundColor: C.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    entry: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    firstEntry: {
        paddingTop: 14,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    rankBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    medal: { fontSize: 18 },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: C.text,
        marginBottom: 2,
    },
    level: {
        fontSize: 11,
        color: C.muted,
    },
    valueBox: {
        alignItems: 'flex-end',
    },
    value: {
        fontSize: 15,
        fontWeight: '800',
    },
    unit: {
        fontSize: 9,
        fontWeight: '600',
        color: C.muted,
        marginTop: 1,
    },
});
