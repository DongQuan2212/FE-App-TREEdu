// app/tabs/quiz.tsx — TREEdu Quiz Screen · v3 Premium
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    Animated,
    Platform,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useQuizFilter }              from '../../src/hooks/useQuizFilter';
import { SORT_OPTIONS, LEVEL_OPTIONS } from '../../src/constants/quiz.constants';
import SearchBar         from '../../src/components/ui/SearchBar';
import QuizCard          from '../../src/components/quiz/QuizCard';
import BottomSheetFilter from '../../src/components/quiz/BottomSheetFilter';

const { width } = Dimensions.get('window');

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
    bg:          '#F8FAF5',
    surface:     '#FFFFFF',
    brand:       '#5A8A2E',
    brandDark:   '#3B6D11',
    brandLight:  '#EAF3DE',
    blue:        '#185FA5',
    blueLight:   '#E6F1FB',
    amber:       '#D97706',
    amberLight:  '#FFF7ED',
    red:         '#DC2626',
    redLight:    '#FEF2F2',
    text:        '#111111',
    muted:       '#9CA3AF',
    mutedDark:   '#6B7280',
    border:      '#EDEEED',
} as const;

const SPACE = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 } as const;

// ── Level chip palette ─────────────────────────────────────────────────────────
const LEVEL_STYLE: Record<string, { bg: string; color: string; activeBg: string }> = {
    all:    { bg: C.brandLight, color: C.brandDark, activeBg: C.brand   },
    easy:   { bg: '#DCFCE7',    color: '#166534',   activeBg: '#16A34A' },
    medium: { bg: C.amberLight, color: '#92400E',   activeBg: C.amber   },
    hard:   { bg: C.redLight,   color: '#991B1B',   activeBg: C.red     },
};

// ── Featured card data ─────────────────────────────────────────────────────────
const FEAT_META = [
    { bg: C.brandLight, accent: C.brand, icon: 'star-outline'  as const, label: 'Nổi bật'  },
    { bg: C.blueLight,  accent: C.blue,  icon: 'flash-outline' as const, label: 'Phổ biến' },
    { bg: C.amberLight, accent: C.amber, icon: 'trending-up'   as const, label: 'Mới nhất' },
];

// ── Skeleton card ──────────────────────────────────────────────────────────────
const SkeletonCard = ({ delay }: { delay: number }) => {
    const opacity = useRef(new Animated.Value(0.4)).current;
    React.useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1,   duration: 750, delay,        useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View style={[sk.card, { opacity }]}>
            <View style={sk.topRow}>
                <View style={sk.badge} /><View style={sk.badge2} />
            </View>
            <View style={sk.titleFull} />
            <View style={sk.titleHalf} />
            <View style={sk.footer}>
                <View style={sk.chip} /><View style={sk.chip} /><View style={sk.chip} />
            </View>
        </Animated.View>
    );
};

const sk = StyleSheet.create({
    card:      { backgroundColor: C.surface, borderRadius: 20, padding: SPACE.md, marginBottom: 10, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6 }, android: { elevation: 2 } }) },
    topRow:    { flexDirection: 'row', gap: SPACE.xs, marginBottom: SPACE.sm },
    badge:     { width: 60, height: 22, borderRadius: 8,  backgroundColor: C.border },
    badge2:    { width: 44, height: 22, borderRadius: 8,  backgroundColor: C.border },
    titleFull: { width: '82%', height: 18, borderRadius: 8, backgroundColor: C.border, marginBottom: 8 },
    titleHalf: { width: '55%', height: 18, borderRadius: 8, backgroundColor: C.border, marginBottom: SPACE.md },
    footer:    { flexDirection: 'row', gap: SPACE.xs },
    chip:      { width: 54, height: 24, borderRadius: 12, backgroundColor: C.border },
});

// ── Featured card ──────────────────────────────────────────────────────────────
const FeaturedCard = ({ quiz, idx, onPress }: { quiz: any; idx: number; onPress: () => void }) => {
    const m     = FEAT_META[idx % FEAT_META.length];
    const scale = useRef(new Animated.Value(1)).current;
    const pressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
    const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                style={[styles.featCard, { backgroundColor: m.bg }, Platform.select({ ios: { shadowColor: m.accent, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 10 }, android: { elevation: 4 } })]}
                activeOpacity={1}
                onPress={onPress}
                onPressIn={pressIn}
                onPressOut={pressOut}
            >
                <View style={[styles.featIconWrap, { backgroundColor: m.accent + '20' }]}>
                    <Ionicons name={m.icon} size={18} color={m.accent} />
                </View>
                <View style={[styles.featBadge, { backgroundColor: m.accent }]}>
                    <Text style={styles.featBadgeText}>{m.label}</Text>
                </View>
                <Text style={styles.featTitle} numberOfLines={2}>{quiz.title ?? 'Bài quiz'}</Text>
                <View style={styles.featFooter}>
                    <Ionicons name="help-circle-outline" size={12} color={m.accent} />
                    <Text style={[styles.featMeta, { color: m.accent }]}>{quiz.questionCount ?? '?'} câu</Text>
                    <Ionicons name="arrow-forward" size={12} color={m.accent} style={{ marginLeft: 'auto' }} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ── Empty state with reset ─────────────────────────────────────────────────────
const EmptyWithReset = ({ onReset }: { onReset: () => void }) => (
    <View style={styles.emptyWrap}>
        <View style={styles.emptyIconWrap}>
            <Ionicons name="search-outline" size={32} color={C.muted} />
        </View>
        <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
        <Text style={styles.emptySub}>Thử thay đổi từ khoá hoặc bộ lọc</Text>
        <TouchableOpacity style={styles.resetBtn} activeOpacity={0.75} onPress={onReset}>
            <Ionicons name="refresh-outline" size={14} color={C.brand} />
            <Text style={styles.resetBtnText}>Xoá tất cả bộ lọc</Text>
        </TouchableOpacity>
    </View>
);

// ── Filter pill button ─────────────────────────────────────────────────────────
const FilterPill = ({
                        label, active, onPress,
                    }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity
        style={[styles.filterPill, active && styles.filterPillActive]}
        activeOpacity={0.7}
        onPress={onPress}
    >
        <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
            {label}
        </Text>
        <Ionicons
            name="chevron-down"
            size={12}
            color={active ? C.brand : C.mutedDark}
        />
    </TouchableOpacity>
);

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function QuizScreen() {
    const router = useRouter();
    const {
        search, setSearch,
        level,  setLevel,
        sortBy, setSortBy,
        closeMenus,
        filtered,
        loading,
        error,
        refreshing,
        refresh,
    } = useQuizFilter();

    const [showLevelSheet, setShowLevelSheet] = useState(false);
    const [showSortSheet,  setShowSortSheet]  = useState(false);

    const featured = useMemo(() => filtered.slice(0, 3), [filtered]);

    const handleQuizPress = useCallback((id: string) => {
        closeMenus();
        router.push(`/quiz/${id}` as any);
    }, []);

    const handleReset = useCallback(async () => {
        try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch (_) {}
        setSearch('');
        setLevel('all');
        setSortBy(SORT_OPTIONS[0]?.value as any);
    }, []);

    // Derive disabled levels — levels that have 0 matching quizzes
    // (In production, pass all quizzes here; we guard with a safe fallback)
    const levelOptionsWithDisabled = useMemo(() =>
            LEVEL_OPTIONS.map(opt => ({
                ...opt,
                disabled: opt.value !== 'all' && filtered.length === 0,
            })),
        [filtered]);

    const currentLevelLabel = LEVEL_OPTIONS.find(o => o.value === level)?.label  ?? 'Cấp độ';
    const currentSortLabel  = SORT_OPTIONS.find(o  => o.value === sortBy)?.label ?? 'Sắp xếp';
    const levelActive = level  !== 'all';
    const defaultSort = SORT_OPTIONS[0]?.value;
    const sortActive  = sortBy !== defaultSort;

    // ── List-only header (title + featured + skeleton — NO search/filter) ──────
    // Search & filter are rendered OUTSIDE FlatList to prevent keyboard dismiss
    const listHeaderElement = useMemo(() => (
        <View>
            {/* Title + count */}
            <View style={styles.titleRow}>
                <View style={styles.titleLeft}>
                    <Text style={styles.screenTitle}>Thư viện Quiz</Text>
                    {!loading && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{filtered.length} bài</Text>
                        </View>
                    )}
                </View>
            </View>
            <Text style={styles.screenSub}>
                {loading ? 'Đang tải...' : 'Rèn luyện kiến thức Tiếng Việt mỗi ngày'}
            </Text>

            {/* Featured */}
            {!loading && !error && featured.length > 0 && (
                <View style={{ marginBottom: SPACE.lg }}>
                    <Text style={styles.sectionLabel}>GỢI Ý HÔM NAY</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={width * 0.56 + SPACE.sm}
                        contentContainerStyle={styles.featScroll}
                    >
                        {featured.map((quiz, i) => (
                            <FeaturedCard
                                key={quiz.id}
                                quiz={quiz}
                                idx={i}
                                onPress={() => handleQuizPress(quiz.id)}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Skeleton */}
            {loading && [0, 1, 2, 3].map(i => <SkeletonCard key={i} delay={i * 120} />)}

            {/* Error */}
            {!loading && error && (
                <View style={styles.emptyWrap}>
                    <Ionicons name="wifi-outline" size={32} color={C.muted} />
                    <Text style={styles.emptyTitle}>Không thể tải dữ liệu</Text>
                    <Text style={styles.emptySub}>{error}</Text>
                </View>
            )}

            {/* All quizzes label */}
            {!loading && !error && filtered.length > 0 && (
                <Text style={[styles.sectionLabel, { marginBottom: SPACE.sm }]}>TẤT CẢ BÀI QUIZ</Text>
            )}
        </View>
    ), [loading, error, filtered, featured]);

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

            {/* ── Sticky search + filter block — lives OUTSIDE FlatList ── */}
            <View style={styles.stickyHeader}>
                {/* Search — stable, never unmounts */}
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Tìm kiếm bài quiz..."
                    onFocus={closeMenus}
                />

                {/* Filter pills row */}
                <View style={styles.filterRow}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipRow}
                        style={{ flex: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {LEVEL_OPTIONS.map(opt => {
                            const col    = LEVEL_STYLE[opt.value] ?? LEVEL_STYLE.all;
                            const active = level === opt.value;
                            return (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[styles.levelChip, { backgroundColor: active ? col.activeBg : col.bg }]}
                                    activeOpacity={0.75}
                                    onPress={async () => {
                                        try { await Haptics.selectionAsync(); } catch (_) {}
                                        setLevel(opt.value);
                                    }}
                                >
                                    {active && (
                                        <Ionicons name="checkmark-circle" size={13} color="#FFF" style={{ marginRight: 4 }} />
                                    )}
                                    <Text style={[
                                        styles.levelChipText,
                                        active ? styles.levelChipTextActive : { color: col.color },
                                    ]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <FilterPill
                        label={currentSortLabel}
                        active={sortActive}
                        onPress={() => setShowSortSheet(true)}
                    />
                </View>
            </View>

            <FlatList
                data={!loading && !error ? filtered : []}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <QuizCard quiz={item} onPress={handleQuizPress} />
                )}
                ListHeaderComponent={listHeaderElement}
                ListEmptyComponent={
                    !loading && !error
                        ? <EmptyWithReset onReset={handleReset} />
                        : null
                }
                ListFooterComponent={<View style={{ height: SPACE.xl }} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={closeMenus}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={[C.brand]}
                        tintColor={C.brand}
                    />
                }
                removeClippedSubviews
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={10}
            />

            {/* ── Bottom sheets ── */}
            <BottomSheetFilter
                visible={showLevelSheet}
                title="Chọn cấp độ"
                options={levelOptionsWithDisabled}
                selected={level}
                onSelect={setLevel}
                onClose={() => setShowLevelSheet(false)}
                accentColor={C.brand}
            />
            <BottomSheetFilter
                visible={showSortSheet}
                title="Sắp xếp theo"
                options={SORT_OPTIONS}
                selected={sortBy}
                onSelect={v => setSortBy(v as any)}
                onClose={() => setShowSortSheet(false)}
                accentColor={C.blue}
            />
        </SafeAreaView>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe:        { flex: 1, backgroundColor: C.bg },
    stickyHeader: {
        paddingHorizontal: SPACE.md,
        paddingTop:        SPACE.sm,
        paddingBottom:     SPACE.xs,
        backgroundColor:   C.bg,
    },
    listContent: { paddingHorizontal: SPACE.md, paddingTop: SPACE.sm },

    // Title
    titleRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    titleLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACE.xs },
    screenTitle: {
        fontSize:      26,
        fontWeight:    '800',
        color:         C.text,
        letterSpacing: -0.3,
    },
    countBadge: {
        backgroundColor:   C.brandLight,
        borderRadius:      20,
        paddingHorizontal: SPACE.xs,
        paddingVertical:   3,
    },
    countBadgeText: { fontSize: 11, fontWeight: '700', color: C.brandDark },
    screenSub:      { fontSize: 13, color: C.muted, marginBottom: SPACE.md },

    // Search

    // Filter row
    filterRow: {
        flexDirection:  'row',
        alignItems:     'center',
        gap:            SPACE.xs,
        marginBottom:   SPACE.lg,
    },
    chipRow: { gap: SPACE.xs, paddingRight: SPACE.xs },
    levelChip: {
        flexDirection:     'row',
        alignItems:        'center',
        borderRadius:      20,
        paddingHorizontal: SPACE.sm,
        paddingVertical:   7,
        minHeight:         34,
    },
    levelChipText:       { fontSize: 13, fontWeight: '600' },
    levelChipTextActive: { color: '#FFFFFF', fontWeight: '700' },

    // Filter pill (sort)
    filterPill: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               4,
        backgroundColor:   C.surface,
        borderRadius:      20,
        paddingHorizontal: SPACE.sm,
        paddingVertical:   7,
        minHeight:         34,
        ...Platform.select({
            ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
            android: { elevation: 1 },
        }),
    },
    filterPillActive:     { backgroundColor: C.brandLight },
    filterPillText:       { fontSize: 12, fontWeight: '600', color: C.mutedDark },
    filterPillTextActive: { color: C.brand },

    // Section label
    sectionLabel: {
        fontSize:      10,
        fontWeight:    '700',
        color:         C.muted,
        letterSpacing: 1.1,
        marginBottom:  SPACE.sm,
    },

    // Featured
    featScroll: { gap: SPACE.sm, paddingRight: SPACE.xs },
    featCard: {
        width:        width * 0.54,
        borderRadius: 20,
        padding:      SPACE.md,
        minHeight:    128,
    },
    featIconWrap: {
        width:          34,
        height:         34,
        borderRadius:   10,
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   6,
    },
    featBadge: {
        alignSelf:         'flex-start',
        borderRadius:      20,
        paddingHorizontal: 8,
        paddingVertical:   2,
        marginBottom:      6,
    },
    featBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFF', letterSpacing: 0.3 },
    featTitle:     { fontSize: 13, fontWeight: '700', color: C.text, lineHeight: 19, flex: 1, marginBottom: 6 },
    featFooter:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
    featMeta:      { fontSize: 11, fontWeight: '600' },

    // Empty state
    emptyWrap: {
        alignItems:   'center',
        paddingTop:   SPACE.xl,
        paddingBottom: SPACE.lg,
        gap:          SPACE.xs,
    },
    emptyIconWrap: {
        width:           64,
        height:          64,
        borderRadius:    32,
        backgroundColor: '#F3F4F6',
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    SPACE.xs,
    },
    emptyTitle: { fontSize: 15, fontWeight: '700', color: C.text },
    emptySub:   { fontSize: 13, color: C.muted, marginBottom: SPACE.sm, textAlign: 'center' },
    resetBtn: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               6,
        backgroundColor:   C.brandLight,
        borderRadius:      20,
        paddingHorizontal: SPACE.md,
        paddingVertical:   10,
        marginTop:         4,
    },
    resetBtnText: { fontSize: 13, fontWeight: '700', color: C.brand },
});
