// app/tabs/home.tsx
import React from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity,
    SafeAreaView, ScrollView, StatusBar,
    Dimensions, Platform, ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons }  from '@expo/vector-icons';
import { useAuth }       from '@/src/context/AuthContext';
import { useMyProfile }  from '@/src/hooks/useMyProfile';

const { width } = Dimensions.get('window');

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
    bg:          '#F8FAF5',
    surface:     '#FFFFFF',
    brand:       '#5A8A2E',
    brandDark:   '#3B6D11',
    brandLight:  '#EAF3DE',
    blue:        '#185FA5',
    blueLight:   '#E6F1FB',
    purple:      '#7E22CE',
    purpleLight: '#F3E8FF',
    amber:       '#D97706',
    amberLight:  '#FFF7ED',
    text:        '#111111',
    muted:       '#9CA3AF',
} as const;

const SP = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 } as const;

const shadow = {
    sm: Platform.select({
        ios:     { shadowColor: '#000',     shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,  elevation: 2 },
        android: { elevation: 2 },
        default: {},
    }),
    md: Platform.select({
        ios:     { shadowColor: '#3B6D11', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 5 },
        android: { elevation: 5 },
        default: {},
    }),
    lg: Platform.select({
        ios:     { shadowColor: '#7E22CE', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 18, elevation: 8 },
        android: { elevation: 8 },
        default: {},
    }),
} as const;

// ── Static data ───────────────────────────────────────────────────────────────
const FEATURES = [
    {
        id: 'quiz', icon: 'grid-outline' as const,
        iconBg: C.brandLight, iconColor: C.brandDark,
        btnBg: C.brand, btnDark: C.brandDark,
        label: 'Bài Quiz', desc: 'Ôn luyện đa dạng với chấm điểm tự động',
        btnText: 'Làm ngay', route: '/tabs/quiz',
    },
    {
        id: 'flashcard', icon: 'layers-outline' as const,
        iconBg: C.blueLight, iconColor: C.blue,
        btnBg: C.blue, btnDark: '#0E4A82',
        label: 'Flashcard', desc: 'Ghi nhớ từ vựng theo chu kỳ lặp lại',
        btnText: 'Tạo bộ từ', route: '/tabs/flashcard',
    },
] as const;

const WHY_CARDS = [
    { id: 'learn',    icon: 'book-outline'    as const, iconBg: C.brandLight,  iconColor: C.brandDark, keyword: 'Học vui',    sub: 'Flashcard + Quiz' },
    { id: 'resource', icon: 'library-outline' as const, iconBg: C.blueLight,   iconColor: C.blue,      keyword: 'Đầy đủ',    sub: 'Từ vựng & ngữ pháp' },
    { id: 'anytime',  icon: 'time-outline'    as const, iconBg: C.amberLight,  iconColor: C.amber,     keyword: 'Mọi lúc',   sub: 'Không cần lịch cố định' },
    { id: 'ai',       icon: 'mic-outline'     as const, iconBg: C.purpleLight, iconColor: C.purple,    keyword: 'AI Phát âm', sub: 'Nhận điểm tức thì' },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────
const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng ☀️';
    if (h < 18) return 'Chào buổi chiều 👋';
    return 'Chào buổi tối 🌙';
};

const isRealName = (name?: string | null): boolean => {
    if (!name?.trim()) return false;
    if (/^\d+$/.test(name.trim())) return false;
    if (name.includes('@')) return false;
    return true;
};

const getInitials = (fullName?: string | null, email?: string | null): string => {
    if (isRealName(fullName)) {
        const parts = fullName!.trim().split(/\s+/);
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return '?';
};

const getDisplayName = (fullName?: string | null, email?: string | null): string => {
    if (isRealName(fullName)) return fullName!.trim().split(/\s+/).at(-1)!;
    if (email) return email.split('@')[0];
    return 'bạn';
};

const getLevelLabel = (level: number): string => {
    if (level <= 1)  return 'Người mới';
    if (level <= 5)  return 'Học viên';
    if (level <= 10) return 'Tiến bộ';
    if (level <= 20) return 'Thành thạo';
    return 'Chuyên gia';
};

// ── Sub-components ────────────────────────────────────────────────────────────
function StatChip({ icon, color, bg, label, value }: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    color: string; bg: string; label: string; value: string;
}) {
    return (
        <View style={[s.statChip, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={16} color={color} />
            <Text style={[s.statValue, { color }]}>{value}</Text>
            <Text style={s.statLabel}>{label}</Text>
        </View>
    );
}

function ProgressBar({ progress }: { progress: number }) {
    const clamped = Math.min(Math.max(progress, 0), 100);
    return (
        <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${clamped}%` as any }]} />
        </View>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const router = useRouter();

    // useAuth → identity từ /auth/current-user (role, email)
    const { user } = useAuth();

    // useMyProfile → gamification từ /users/me (XP, streak, level...)
    const { profile, loading: profileLoading, refreshing, refresh } = useMyProfile();

    const greeting = getGreeting();

    // Tên hiển thị: ưu tiên profile.fullName (từ /me), fallback user.email
    const displayFullName = profile?.fullName ?? null;
    const displayEmail    = user?.email       ?? null;
    const initials        = getInitials(displayFullName, displayEmail);
    const shortName       = getDisplayName(displayFullName, displayEmail);

    // Gamification — từ /users/me
    const streakDays  = profile?.streakCount           ?? 0;
    const xp          = profile?.xp                    ?? 0;
    const level       = profile?.level                 ?? 1;
    const quizDone    = profile?.totalQuizCompleted    ?? 0;
    const flashDone   = profile?.totalFlashcardLearned ?? 0;
    const levelLabel  = getLevelLabel(level);

    const todayProgress = Math.min(
        ((quizDone % 5) * 20) + Math.min((flashDone % 10) * 5, 50),
        100,
    );

    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle="light-content" backgroundColor={C.brandDark} />

            {/* ── Hero banner ── */}
            <View style={s.heroBanner}>
                <View style={s.bannerCircle1} />
                <View style={s.bannerCircle2} />
                <View style={s.bannerRow}>
                    <View style={s.bannerLeft}>
                        <Text style={s.bannerGreeting}>{greeting}</Text>
                        <Text style={s.bannerName}>{shortName}</Text>
                        <View style={s.levelBadge}>
                            <Ionicons name="star" size={11} color="#FBBF24" />
                            <Text style={s.levelText}>Lv.{level} · {levelLabel}</Text>
                        </View>
                    </View>
                    <View style={s.bannerRight}>
                        <View style={[s.avatar, shadow.sm as any]}>
                            <Text style={s.avatarText}>{initials}</Text>
                        </View>
                        <View style={s.streakPill}>
                            <Text style={s.streakFire}>🔥</Text>
                            <Text style={s.streakCount}>{streakDays} ngày</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                style={s.scroll}
                contentContainerStyle={s.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={[C.brand]}
                        tintColor={C.brand}
                    />
                }
            >
                {/* ── Stats chips ── */}
                {profileLoading ? (
                    <View style={s.statsLoadingRow}>
                        <ActivityIndicator size="small" color={C.brand} />
                    </View>
                ) : (
                    <View style={s.statsRow}>
                        <StatChip icon="flash-outline"            color={C.amber} bg={C.amberLight} label="XP"        value={xp.toLocaleString('vi-VN')} />
                        <StatChip icon="checkmark-circle-outline" color={C.brand} bg={C.brandLight} label="Quiz"      value={String(quizDone)} />
                        <StatChip icon="layers-outline"           color={C.blue}  bg={C.blueLight}  label="Flashcard" value={String(flashDone)} />
                    </View>
                )}

                {/* ── Progress card ── */}
                <View style={[s.progressCard, shadow.sm as any]}>
                    <View style={s.progressTop}>
                        <View style={s.progressIcon}>
                            <Ionicons name="trophy-outline" size={18} color={C.amber} />
                        </View>
                        <Text style={s.progressTitle}>Mục tiêu hôm nay</Text>
                        <Text style={s.progressPct}>{todayProgress}%</Text>
                    </View>
                    <ProgressBar progress={todayProgress} />
                    <Text style={s.progressSub}>
                        {todayProgress === 0
                            ? 'Hãy bắt đầu học để đạt mục tiêu hôm nay! 🚀'
                            : todayProgress >= 100
                                ? '🎉 Xuất sắc! Bạn đã hoàn thành mục tiêu hôm nay!'
                                : `Đã hoàn thành ${todayProgress}% mục tiêu — tiếp tục nào! 💪`
                        }
                    </Text>
                </View>

                {/* ── Feature cards ── */}
                <Text style={s.sectionLabel}>TÍNH NĂNG</Text>
                <View style={s.gridRow}>
                    {FEATURES.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[s.card, shadow.md as any]}
                            activeOpacity={0.7}
                            onPress={() => router.push(item.route as any)}
                        >
                            <View style={[s.iconBox, { backgroundColor: item.iconBg }]}>
                                <Ionicons name={item.icon} size={24} color={item.iconColor} />
                            </View>
                            <Text style={s.cardTitle}>{item.label}</Text>
                            <Text style={s.cardDesc}>{item.desc}</Text>
                            <View style={[s.cardBtn, { backgroundColor: item.btnBg }]}>
                                <View style={[StyleSheet.absoluteFill, {
                                    borderRadius: 12, backgroundColor: item.btnDark,
                                    opacity: 0.35, marginLeft: '50%',
                                }]} />
                                <Text style={s.cardBtnText}>{item.btnText}</Text>
                                <Ionicons name="arrow-forward" size={13} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Pronunciation hero card ── */}
                <TouchableOpacity
                    style={[s.heroCard, shadow.lg as any]}
                    activeOpacity={0.7}
                    onPress={() => router.push('/tabs/pronunciation' as any)}
                >
                    <View style={s.heroBlobA} />
                    <View style={s.heroBlobB} />
                    <View style={s.aiBadge}>
                        <Text style={s.aiBadgeText}>✦ AI Powered</Text>
                    </View>
                    <View style={s.heroCardRow}>
                        <View style={s.heroCardLeft}>
                            <Text style={s.heroCardTitle}>Phát Âm AI</Text>
                            <Text style={s.heroCardDesc}>Luyện nói chuẩn — nhận điểm tức thì</Text>
                            <View style={s.heroCardBtn}>
                                <Text style={s.heroCardBtnText}>Luyện nói</Text>
                                <Ionicons name="arrow-forward" size={14} color={C.purple} />
                            </View>
                        </View>
                        <View style={s.micWrap}>
                            <View style={s.micRing3} />
                            <View style={s.micRing2} />
                            <View style={s.micRing1} />
                            <View style={s.micCore}>
                                <Ionicons name="mic" size={28} color={C.purple} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* ── Why TREEdu ── */}
                <Text style={[s.sectionLabel, { marginTop: SP.xs }]}>TẠI SAO CHỌN TREEDU?</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={width * 0.44 + SP.sm}
                    contentContainerStyle={s.whyScroll}
                >
                    {WHY_CARDS.map((card) => (
                        <View key={card.id} style={[s.whyCard, shadow.sm as any]}>
                            <View style={[s.whyIconBox, { backgroundColor: card.iconBg }]}>
                                <Ionicons name={card.icon} size={22} color={card.iconColor} />
                            </View>
                            <Text style={[s.whyKeyword, { color: card.iconColor }]}>{card.keyword}</Text>
                            <Text style={s.whySub}>{card.sub}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={{ height: SP.xl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.bg },

    heroBanner:     { backgroundColor: C.brandDark, overflow: 'hidden', paddingHorizontal: SP.md, paddingTop: SP.md, paddingBottom: SP.lg + 4 },
    bannerCircle1:  { position: 'absolute', width: 160, height: 160, borderRadius: 80,  backgroundColor: '#4A8020', opacity: 0.45, right: -40,  top: -50 },
    bannerCircle2:  { position: 'absolute', width: 100, height: 100, borderRadius: 50,  backgroundColor: '#6AAD30', opacity: 0.25, left: -20, bottom: -30 },
    bannerRow:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    bannerLeft:     { flex: 1, paddingRight: SP.sm },
    bannerGreeting: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: '500', marginBottom: 4, letterSpacing: 0.3 },
    bannerName:     { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
    levelBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    levelText:      { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
    bannerRight:    { alignItems: 'center', gap: SP.xs },
    avatar:         { width: 52, height: 52, borderRadius: 26, backgroundColor: '#C0DD97', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
    avatarText:     { fontSize: 17, fontWeight: '800', color: C.brandDark },
    streakPill:     { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: SP.xs, paddingVertical: 4, gap: 3 },
    streakFire:     { fontSize: 12 },
    streakCount:    { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },

    scroll:        { flex: 1 },
    scrollContent: { paddingHorizontal: SP.md, paddingTop: SP.md },

    statsLoadingRow: { height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: SP.md },
    statsRow:  { flexDirection: 'row', gap: SP.xs, marginBottom: SP.md },
    statChip:  { flex: 1, borderRadius: 16, padding: SP.sm, alignItems: 'center', gap: 3 },
    statValue: { fontSize: 16, fontWeight: '800' },
    statLabel: { fontSize: 10, fontWeight: '600', color: C.muted, letterSpacing: 0.3 },

    progressCard:  { backgroundColor: C.surface, borderRadius: 20, padding: SP.md, marginBottom: SP.lg },
    progressTop:   { flexDirection: 'row', alignItems: 'center', marginBottom: SP.sm, gap: 8 },
    progressIcon:  { width: 32, height: 32, borderRadius: 10, backgroundColor: C.amberLight, alignItems: 'center', justifyContent: 'center' },
    progressTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: C.text },
    progressPct:   { fontSize: 16, fontWeight: '800', color: C.brand },
    progressTrack: { height: 8, backgroundColor: C.bg, borderRadius: 8, overflow: 'hidden', marginBottom: SP.xs },
    progressFill:  { height: 8, backgroundColor: C.brand, borderRadius: 8 },
    progressSub:   { fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 17 },

    sectionLabel: { fontSize: 11, fontWeight: '600', color: C.muted, letterSpacing: 0.8, marginBottom: SP.sm },

    gridRow:     { flexDirection: 'row', gap: SP.sm, marginBottom: SP.sm },
    card:        { flex: 1, backgroundColor: C.surface, borderRadius: 24, padding: SP.md },
    iconBox:     { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: SP.sm },
    cardTitle:   { fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 4 },
    cardDesc:    { fontSize: 11, color: C.muted, lineHeight: 16, marginBottom: SP.md, flex: 1 },
    cardBtn:     { height: 40, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
    cardBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

    heroCard:        { backgroundColor: '#FAF5FF', borderRadius: 24, padding: SP.md, marginBottom: SP.lg, overflow: 'hidden', minHeight: 140 },
    heroBlobA:       { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#EDE9FE', right: -20, top: -20, opacity: 0.7 },
    heroBlobB:       { position: 'absolute', width: 80,  height: 80,  borderRadius: 40, backgroundColor: '#DDD6FE', right: 40,  bottom: -20, opacity: 0.5 },
    aiBadge:         { alignSelf: 'flex-start', backgroundColor: '#EDE9FE', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: SP.sm },
    aiBadgeText:     { fontSize: 11, fontWeight: '700', color: C.purple, letterSpacing: 0.4 },
    heroCardRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heroCardLeft:    { flex: 1 },
    heroCardTitle:   { fontSize: 20, fontWeight: '800', color: C.purple, marginBottom: 4 },
    heroCardDesc:    { fontSize: 12, color: '#7C3AED', opacity: 0.7, lineHeight: 17, marginBottom: SP.sm },
    heroCardBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#EDE9FE', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
    heroCardBtnText: { fontSize: 13, fontWeight: '700', color: C.purple },
    micWrap:  { width: 90, height: 90, alignItems: 'center', justifyContent: 'center' },
    micRing3: { position: 'absolute', width: 88, height: 88, borderRadius: 44, backgroundColor: '#DDD6FE', opacity: 0.3 },
    micRing2: { position: 'absolute', width: 66, height: 66, borderRadius: 33, backgroundColor: '#C4B5FD', opacity: 0.35 },
    micRing1: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: '#A78BFA', opacity: 0.25 },
    micCore:  { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },

    whyScroll:  { paddingRight: SP.md, paddingBottom: 4, gap: SP.sm },
    whyCard:    { width: width * 0.42, backgroundColor: C.surface, borderRadius: 20, padding: SP.md, alignItems: 'flex-start' },
    whyIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: SP.sm },
    whyKeyword: { fontSize: 14, fontWeight: '800', marginBottom: 3 },
    whySub:     { fontSize: 11, color: C.muted, lineHeight: 16 },
});
