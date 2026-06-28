// app/profile/flashcard-history.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StatusBar, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Stack, useRouter} from 'expo-router';
import { Ionicons }     from '@expo/vector-icons';

import axiosClient       from '../../src/constants/axiosClient';
import { API_ENDPOINTS } from '../../src/constants/api';

// ── Types ─────────────────────────────────────────────────
interface FlashcardHistory {
    id:                 string;
    flashcardId:        string;
    flashcardTitle:     string;
    totalWords:         number;
    viewedWordCount:    number;
    progressPercentage: number;
    status:             'IN_PROGRESS' | 'DONE';
    startedAt:          string;
}

// ── Helpers ───────────────────────────────────────────────
const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
};

// ── Sub-components ────────────────────────────────────────
interface StatCardProps {
    iconName:  React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    iconBg:    string;
    label:     string;
    value:     string | number;
}

function StatCard({ iconName, iconColor, iconBg, label, value }: StatCardProps) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1, borderColor: '#E5E7EB',
            padding: 16,
            flexDirection: 'row', alignItems: 'center', gap: 12,
        }}>
            <View style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: iconBg,
                alignItems: 'center', justifyContent: 'center',
            }}>
                <Ionicons name={iconName} size={20} color={iconColor} />
            </View>
            <View>
                <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600', marginBottom: 2 }}>
                    {label}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

function HistoryCard({ item, onPress }: { item: FlashcardHistory; onPress: () => void }) {
    const isDone = item.status === 'DONE';
    const progress = Math.round(item.progressPercentage);

    return (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1, borderColor: '#E5E7EB',
            padding: 16,
            marginBottom: 10,
        }}>
            {/* Title row */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 }}
                          numberOfLines={2}>
                        {item.flashcardTitle}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                            {formatDate(item.startedAt)}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#D1D5DB', marginHorizontal: 4 }}>·</Text>
                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                            {item.totalWords} từ
                        </Text>
                    </View>
                </View>

                {/* Status badge */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                    paddingHorizontal: 10, paddingVertical: 4,
                    borderRadius: 20,
                    backgroundColor: isDone ? '#ECFDF5' : '#F9FAFB',
                    borderWidth: 1,
                    borderColor: isDone ? '#A7F3D0' : '#E5E7EB',
                }}>
                    <Ionicons
                        name={isDone ? 'checkmark-circle' : 'time-outline'}
                        size={12}
                        color={isDone ? '#059669' : '#6B7280'}
                    />
                    <Text style={{
                        fontSize: 11, fontWeight: '700',
                        color: isDone ? '#059669' : '#6B7280',
                    }}>
                        {isDone ? 'Hoàn thành' : 'Đang học'}
                    </Text>
                </View>
            </View>

            {/* Progress bar */}
            <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '600' }}>Tiến độ</Text>
                    <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '700' }}>
                        {item.viewedWordCount}/{item.totalWords} từ · {progress}%
                    </Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{
                        height: '100%',
                        width: `${progress}%`,
                        borderRadius: 3,
                        backgroundColor: isDone ? '#10B981' : '#1C1C1C',
                    }} />
                </View>
            </View>

            {/* Action */}
            <TouchableOpacity
                onPress={onPress}
                style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                    height: 40,
                    borderRadius: 10,
                    borderWidth: 1.5, borderColor: '#E5E7EB',
                    backgroundColor: '#FAFAFA',
                }}
                activeOpacity={0.75}
            >
                <Ionicons name="eye-outline" size={15} color="#374151" />
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>Xem chi tiết</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Empty state ───────────────────────────────────────────
function EmptyState({ onGoLearn }: { onGoLearn: () => void }) {
    return (
        <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 }}>
            <View style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: '#F3F4F6',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
            }}>
                <Ionicons name="flash-outline" size={32} color="#9CA3AF" />
            </View>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 6 }}>
                Chưa có lịch sử học
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 }}>
                Bạn chưa học bộ Flashcard nào. Hãy bắt đầu ngay!
            </Text>
            <TouchableOpacity
                onPress={onGoLearn}
                style={{
                    backgroundColor: '#1C1C1C', borderRadius: 12,
                    paddingHorizontal: 28, paddingVertical: 12,
                }}
                activeOpacity={0.85}
            >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Học ngay</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Skeleton ──────────────────────────────────────────────
function SkeletonCard() {
    return (
        <View style={{
            backgroundColor: '#fff', borderRadius: 16,
            borderWidth: 1, borderColor: '#E5E7EB',
            padding: 16, marginBottom: 10,
        }}>
            <View style={{ width: '70%', height: 14, backgroundColor: '#F3F4F6', borderRadius: 6, marginBottom: 8 }} />
            <View style={{ width: '40%', height: 11, backgroundColor: '#F3F4F6', borderRadius: 6, marginBottom: 16 }} />
            <View style={{ width: '100%', height: 6,  backgroundColor: '#F3F4F6', borderRadius: 3, marginBottom: 12 }} />
            <View style={{ width: '100%', height: 40, backgroundColor: '#F9FAFB', borderRadius: 10 }} />
        </View>
    );
}

// ── Main screen ───────────────────────────────────────────
export default function FlashcardHistoryScreen() {
    const router = useRouter();

    const [histories,  setHistories]  = useState<FlashcardHistory[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error,      setError]      = useState<string | null>(null);

    const fetchHistories = useCallback(async () => {
        try {
            setError(null);
            const { data } = await axiosClient.get(
                `${API_ENDPOINTS.flashcardList}/learn`,
            );
            const list: FlashcardHistory[] = data?.data ?? data ?? [];
            // Mới nhất lên đầu
            list.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
            setHistories(list);
        } catch (err: any) {
            console.error('Fetch flashcard history error:', err);
            setError('Không thể tải lịch sử học.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchHistories(); }, [fetchHistories]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchHistories();
    };

    // Stats
    const stats = {
        total:       histories.length,
        completed:   histories.filter(h => h.status === 'DONE').length,
        avgProgress: histories.length > 0
            ? Math.round(histories.reduce((acc, h) => acc + h.progressPercentage, 0) / histories.length)
            : 0,
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F4' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F6F4" />
            <Stack.Screen  options={{ headerShown: false }} />

            {/* ── Header ── */}
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 20, paddingVertical: 14,
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 38, height: 38, borderRadius: 19,
                        backgroundColor: '#fff',
                        borderWidth: 1, borderColor: '#E5E7EB',
                        alignItems: 'center', justifyContent: 'center',
                        marginRight: 12,
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={20} color="#374151" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827' }}>
                        Lịch sử Flashcard
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>
                        Theo dõi tiến độ học của bạn
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3D7A5C" />
                }
            >
                {/* ── Stats ── */}
                {!loading && histories.length > 0 && (
                    <View style={{ gap: 8, marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <StatCard iconName="book-outline"          iconColor="#2563EB" iconBg="#EFF6FF"
                                      label="Đang học"    value={stats.total} />
                            <StatCard iconName="checkmark-circle-outline" iconColor="#059669" iconBg="#ECFDF5"
                                      label="Hoàn thành"  value={stats.completed} />
                        </View>
                        <StatCard iconName="bar-chart-outline" iconColor="#D97706" iconBg="#FFFBEB"
                                  label="Tiến độ trung bình" value={`${stats.avgProgress}%`} />
                    </View>
                )}

                {/* ── Content ── */}
                {loading ? (
                    <>
                        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                    </>
                ) : error ? (
                    <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                        <Ionicons name="cloud-offline-outline" size={40} color="#D1D5DB" style={{ marginBottom: 12 }} />
                        <Text style={{ fontSize: 14, color: '#EF4444', marginBottom: 16, textAlign: 'center' }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={fetchHistories}
                            style={{
                                borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
                                paddingHorizontal: 20, paddingVertical: 10,
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>Thử lại</Text>
                        </TouchableOpacity>
                    </View>
                ) : histories.length === 0 ? (
                    <EmptyState onGoLearn={() => router.push('/flashcard' as any)} />
                ) : (
                    histories.map(item => (
                        <HistoryCard
                            key={item.id}
                            item={item}
                            onPress={() => router.push(`/flashcard/${item.flashcardId}` as any)}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
