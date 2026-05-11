// src/components/quiz/QuizCard.tsx — Premium redesign
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quiz } from '../../types/quiz';
import { LEVEL_CONFIG } from '../../constants/quiz.constants';

interface Props {
    quiz:    Quiz;
    onPress: (id: string) => void;
}

export default function QuizCard({ quiz, onPress }: Props) {
    const lv    = LEVEL_CONFIG[quiz.level] ?? { bg: '#F4F4F5', text: '#71717A' };
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () =>
        Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 4 }).start();

    const handlePressOut = () =>
        Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
            <TouchableOpacity
                style={styles.card}
                activeOpacity={1}
                onPress={() => onPress(quiz.id)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {/* ── Top row: topic badge + level badge ── */}
                <View style={styles.topRow}>
                    <View style={styles.topicBadge}>
                        <Ionicons name="pricetag-outline" size={11} color="#6B7280" />
                        <Text style={styles.topicText} numberOfLines={1}>{quiz.topic}</Text>
                    </View>
                    <View style={[styles.levelBadge, { backgroundColor: lv.bg }]}>
                        <Text style={[styles.levelText, { color: lv.text }]}>LV {quiz.level}</Text>
                    </View>
                </View>

                {/* ── Title ── */}
                <Text style={styles.title} numberOfLines={2}>{quiz.title}</Text>

                {/* ── Meta ── */}
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="help-circle-outline" size={13} color="#9CA3AF" />
                        <Text style={styles.metaText}>{quiz.questionCount} câu</Text>
                    </View>
                    <View style={styles.metaDot} />
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                        <Text style={styles.metaText}>{quiz.timer} phút</Text>
                    </View>
                </View>

                {/* ── Footer ── */}
                <View style={styles.footer}>
                    <Text style={styles.footerLabel}>Làm bài ngay</Text>
                    <View style={styles.arrowBtn}>
                        <Ionicons name="arrow-forward" size={14} color="#5A8A2E" />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
        borderRadius: 20,
        ...Platform.select({
            ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
            android: { elevation: 3 },
        }),
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius:    20,
        paddingHorizontal: 18,
        paddingVertical:   16,
        overflow:          'hidden',
    },

    // ── Top row ────────────────────────────────────────────
    topRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   10,
    },
    topicBadge: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               5,
        backgroundColor:   '#F3F4F6',
        borderRadius:      8,
        paddingHorizontal: 10,
        paddingVertical:   5,
        maxWidth:          '58%',
    },
    topicText: {
        fontSize:   11,
        color:      '#6B7280',
        fontWeight: '500',
    },
    levelBadge: {
        borderRadius:      8,
        paddingHorizontal: 10,
        paddingVertical:   5,
    },
    levelText: {
        fontSize:      11,
        fontWeight:    '800',
        letterSpacing: 0.4,
    },

    // ── Title ──────────────────────────────────────────────
    title: {
        fontSize:     17,
        fontWeight:   '800',
        color:        '#111111',
        lineHeight:   24,
        marginBottom: 8,
        letterSpacing: -0.2,
    },

    // ── Meta ───────────────────────────────────────────────
    metaRow: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           6,
        marginBottom:  14,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           4,
    },
    metaText: {
        fontSize:   12,
        color:      '#9CA3AF',
        fontWeight: '500',
    },
    metaDot: {
        width:           3,
        height:          3,
        borderRadius:    1.5,
        backgroundColor: '#D1D5DB',
    },

    // ── Footer ─────────────────────────────────────────────
    footer: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop:     12,
    },
    footerLabel: {
        fontSize:   12,
        fontWeight: '600',
        color:      '#C4D1B8',          // deliberately muted — focus stays on title
        letterSpacing: 0.2,
    },
    arrowBtn: {
        width:           30,
        height:          30,
        borderRadius:    15,
        backgroundColor: '#EAF3DE',
        alignItems:      'center',
        justifyContent:  'center',
    },
});
