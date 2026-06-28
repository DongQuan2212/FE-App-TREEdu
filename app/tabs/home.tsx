import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity,
    SafeAreaView, ScrollView, StatusBar,
    Dimensions, Platform, ActivityIndicator,
    RefreshControl, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth }        from '@/src/context/AuthContext';
import { useMyProfile }   from '@/src/hooks/useMyProfile';
import { useMyTree }      from '@/src/hooks/useMyTree';
import { useLeaderboard } from '@/src/hooks/useLeaderboard';
import { useNotifications } from '@/src/hooks/useNotifications';

// 2. Import Components theo đúng đường dẫn trong ảnh của bạn
import NotificationDropdown from '@/src/components/ui/NotificationDropdown';
import NotificationDetailModal from '@/src/components/ui/NotificationDetailModal';


const { width } = Dimensions.get('window');

// ── Design tokens ──────────────────────────────────────────────────────────
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
    orange:      '#EA580C',
    orangeLight: '#FFF1EB',
    text:        '#111111',
    muted:       '#9CA3AF',
    mutedLight:  '#F3F4F6',
} as const;

const SP = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 } as const;

const shadow = {
    sm: Platform.select({
        ios:     { shadowColor: '#000',    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,  elevation: 2 },
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
    orange: Platform.select({
        ios:     { shadowColor: '#EA580C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.20, shadowRadius: 12, elevation: 5 },
        android: { elevation: 5 },
        default: {},
    }),
} as const;

// ── Static data ────────────────────────────────────────────────────────────
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

const TESTIMONIALS = [
    { id: '1', name: 'Nguyễn Lan Anh', text: 'Từ 5.5 lên 7.0 IELTS chỉ sau 2 tháng nhờ AI phát âm!', rating: 5, initials: 'LA', bg: '#DCFCE7', color: '#166534' },
    { id: '2', name: 'Trần Minh Quân', text: 'Flashcard giúp mình nhớ 1000 từ trong 3 tuần. Quá ngon!', rating: 5, initials: 'MQ', bg: '#DBEAFE', color: '#1E40AF' },
    { id: '3', name: 'Phạm Thu Hà',    text: 'Đề thi giống đề thật đến 95%. Đạt 9.0 môn Anh THPT QG!', rating: 5, initials: 'TH', bg: '#FCE7F3', color: '#9D174D' },
] as const;

const AVATAR_COLORS: [string, string][] = [
    ['#DBEAFE', '#1E40AF'], ['#DCFCE7', '#166534'], ['#FCE7F3', '#9D174D'],
    ['#EDE9FE', '#5B21B6'], ['#FFEDD5', '#9A3412'], ['#F0FDF4', '#14532D'],
];

// ── Helpers ────────────────────────────────────────────────────────────────
const hashColor = (userId = ''): [string, string] => {
    let h = 0;
    for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

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

const getFullImageUrl = (url?: string | null): string | null => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const BASE_URL = 'http://10.0.2.2:3001';
    return url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
};

// ── Shared Avatar component ────────────────────────────────────────────────
function UserAvatar({
                        avatarUrl, initials, size, bg, textColor, borderColor,
                    }: {
    avatarUrl?: string | null;
    initials: string;
    size: number;
    bg: string;
    textColor: string;
    borderColor?: string;
}) {
    const [imgError, setImgError] = useState(false);

    const containerStyle = {
        width: size, height: size, borderRadius: size / 2,
        overflow: 'hidden' as const,
        ...(borderColor ? { borderWidth: 2.5, borderColor } : {}),
    };

    if (avatarUrl && !imgError) {
        return (
            <View style={containerStyle}>
                <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: size, height: size }}
                    onError={() => setImgError(true)}
                />
            </View>
        );
    }

    return (
        <View style={[containerStyle, { backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: size * 0.32, fontWeight: '800', color: textColor }}>
                {initials}
            </Text>
        </View>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────
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

// ── Leaderboard Section ────────────────────────────────────────────────────
type LBTab = 'TOTAL_XP' | 'STREAK';

function LeaderboardSection() {
    const [activeTab, setActiveTab] = useState<LBTab>('STREAK');

    const { data: streakData, loading: streakLoading, myRank: streakMyRank } = useLeaderboard('STREAK');
    const { data: xpData,     loading: xpLoading,     myRank: xpMyRank }     = useLeaderboard('TOTAL_XP');

    const entries   = activeTab === 'STREAK' ? streakData   : xpData;
    const isLoading = activeTab === 'STREAK' ? streakLoading : xpLoading;
    const myRank    = activeTab === 'STREAK' ? streakMyRank  : xpMyRank;
    const isStreak  = activeTab === 'STREAK';

    const top3 = entries.filter((e) => e.rank <= 3);
    const rest  = entries.filter((e) => e.rank  > 3);

    const podiumOrder = [
        top3.find((e) => e.rank === 2),
        top3.find((e) => e.rank === 1),
        top3.find((e) => e.rank === 3),
    ].filter(Boolean) as typeof entries;

    const unit     = isStreak ? 'ngày' : 'XP';
    const valColor = isStreak ? C.amber : C.blue;
    const iconName = isStreak ? ('flame' as const) : ('flash' as const);

    return (
        <View style={s.lbContainer}>
            <View style={s.lbHeader}>
                <View>
                    <Text style={s.lbTitle}>Bảng xếp hạng</Text>
                    <Text style={s.lbSubtitle}>Cạnh tranh cùng học viên toàn hệ thống</Text>
                </View>
                <Ionicons name="trophy-outline" size={22} color={C.amber} />
            </View>

            <View style={s.lbTabBar}>
                {([
                    { key: 'STREAK'   as LBTab, label: 'Streak dài nhất', icon: 'flame' as const, activeColor: C.orange },
                    { key: 'TOTAL_XP' as LBTab, label: 'Tổng điểm XP',   icon: 'flash' as const, activeColor: C.blue   },
                ]).map(({ key, label, icon, activeColor }) => (
                    <TouchableOpacity
                        key={key}
                        style={[s.lbTab, activeTab === key && s.lbTabActive]}
                        onPress={() => setActiveTab(key)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={icon} size={13} color={activeTab === key ? activeColor : C.muted} />
                        <Text style={[s.lbTabText, activeTab === key && { color: C.text }]}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {myRank && (
                <View style={s.myRankBadge}>
                    <Ionicons name="trophy" size={11} color="#10B981" />
                    <Text style={s.myRankText}>Vị trí của bạn: </Text>
                    <Text style={s.myRankNum}>#{myRank}</Text>
                </View>
            )}

            {isLoading ? (
                <View style={s.lbLoading}>
                    <ActivityIndicator size="small" color={C.brand} />
                </View>
            ) : entries.length === 0 ? (
                <View style={s.lbEmpty}>
                    <Ionicons name="trophy-outline" size={32} color={C.muted} />
                    <Text style={s.lbEmptyText}>Chưa có dữ liệu</Text>
                </View>
            ) : (
                <>
                    {podiumOrder.length > 0 && (
                        <View style={s.podiumRow}>
                            {podiumOrder.map((entry) => {
                                const isTop1    = entry.rank === 1;
                                const [avatarBg, avatarColor] = hashColor(entry.userId);
                                const blockH    = isTop1 ? 80 : entry.rank === 2 ? 58 : 42;
                                const avatarSize = isTop1 ? 60 : 48;
                                const entryInitials = (entry.displayName ?? 'A')[0].toUpperCase();

                                return (
                                    <View key={entry.userId} style={[s.podiumItem, { width: isTop1 ? 120 : 100 }]}>
                                        {isTop1 && <Text style={s.podiumCrown}>👑</Text>}
                                        <View style={s.podiumAvatarWrap}>
                                            <UserAvatar
                                                avatarUrl={entry.avatarUrl}
                                                initials={entryInitials}
                                                size={avatarSize}
                                                bg={avatarBg}
                                                textColor={avatarColor}
                                                borderColor="#FFFFFF"
                                            />
                                        </View>
                                        {!isTop1 && (
                                            <View style={[s.podiumRankBadge, {
                                                backgroundColor: entry.rank === 2 ? '#E5E7EB' : '#FFEDD5',
                                            }]}>
                                                <Text style={[s.podiumRankBadgeText, {
                                                    color: entry.rank === 2 ? '#6B7280' : C.orange,
                                                }]}>{entry.rank}</Text>
                                            </View>
                                        )}
                                        <Text style={[s.podiumName, { fontSize: isTop1 ? 12 : 11 }]} numberOfLines={1}>
                                            {entry.displayName ?? 'Ẩn danh'}
                                        </Text>
                                        {entry.isMe && (
                                            <View style={s.podiumMeBadge}>
                                                <Text style={s.podiumMeText}>Bạn</Text>
                                            </View>
                                        )}
                                        <View style={s.podiumValue}>
                                            <Ionicons name={iconName} size={11} color={valColor} />
                                            <Text style={[s.podiumValueText, { color: valColor }]}>{entry.value}</Text>
                                            <Text style={s.podiumUnit}>{unit}</Text>
                                        </View>
                                        <View style={[s.podiumBlock, {
                                            height: blockH,
                                            backgroundColor: isTop1 ? '#FEF9C3' : entry.rank === 2 ? '#F9FAFB' : '#FFF7ED',
                                            borderColor:     isTop1 ? '#FDE68A' : entry.rank === 2 ? '#E5E7EB' : '#FFEDD5',
                                        }]}>
                                            {isTop1 && <Text style={s.podiumBlockNum}>1</Text>}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {rest.length > 0 && (
                        <View style={s.restList}>
                            {rest.map((entry) => {
                                const [avatarBg, avatarColor] = hashColor(entry.userId);
                                const entryInitials = (entry.displayName ?? 'A')[0].toUpperCase();
                                return (
                                    <View key={entry.userId} style={[s.restRow, entry.isMe && s.restRowMe]}>
                                        <Text style={s.restRank}>{entry.rank}</Text>
                                        <UserAvatar
                                            avatarUrl={entry.avatarUrl}
                                            initials={entryInitials}
                                            size={34}
                                            bg={avatarBg}
                                            textColor={avatarColor}
                                        />
                                        <View style={s.restInfo}>
                                            <View style={s.restNameRow}>
                                                <Text style={s.restName} numberOfLines={1}>
                                                    {entry.displayName ?? 'Học viên'}
                                                </Text>
                                                {entry.isMe && (
                                                    <View style={s.meBadge}>
                                                        <Text style={s.meBadgeText}>Bạn</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={s.restLevel}>Cấp {entry.level ?? 1}</Text>
                                        </View>
                                        <View style={s.restValueRow}>
                                            <Ionicons name={iconName} size={12} color={C.muted} />
                                            <Text style={s.restValue}>{entry.value}</Text>
                                            <Text style={s.restUnit}>{unit}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

// ── Testimonials ───────────────────────────────────────────────────────────
function TestimonialsSection() {
    return (
        <View style={s.testimonialContainer}>
            <Text style={s.testimonialTitle}>Học viên nói gì về TREEdu?</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={width * 0.75 + SP.sm}
                contentContainerStyle={s.testimonialScroll}
            >
                {TESTIMONIALS.map((item) => (
                    <View key={item.id} style={[s.testimonialCard, shadow.sm as any]}>
                        <View style={[s.testimonialAvatar, { backgroundColor: item.bg }]}>
                            <Text style={[s.testimonialAvatarText, { color: item.color }]}>{item.initials}</Text>
                        </View>
                        <Text style={s.testimonialStars}>{'★'.repeat(item.rating)}</Text>
                        <Text style={s.testimonialQuote}>{item.text}</Text>
                        <Text style={s.testimonialName}>— {item.name}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useNotifications();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNotif, setSelectedNotif]   = useState<any>(null);
    const router = useRouter();
    const { user }   = useAuth();
    const { profile, loading: profileLoading, refreshing, refresh } = useMyProfile();
    const { refreshTree } = useMyTree();

    const greeting        = getGreeting();
    const displayFullName = profile?.fullName ?? null;
    const displayEmail    = user?.email       ?? null;
    const initials        = getInitials(displayFullName, displayEmail);
    const shortName       = getDisplayName(displayFullName, displayEmail);

    const streakDays = profile?.streakCount           ?? 0;
    const xp         = profile?.xp                    ?? 0;
    const level      = profile?.level                 ?? 1;
    const quizDone   = profile?.totalQuizCompleted    ?? 0;
    const flashDone  = profile?.totalFlashcardLearned ?? 0;
    const levelLabel = getLevelLabel(level);

    const onRefreshAll = async () => {
        await Promise.all([refresh(), refreshTree()]);
    };

    // Bạn có thể lấy số lượng thông báo chưa đọc từ API ở đây
    const unreadNotificationsCount = 3;
    const handleNotificationClick = async (notif: any) => {
        // Đóng dropdown list lại
        setIsDropdownOpen(false);

        // Mở Modal chi tiết và truyền data vào
        setSelectedNotif(notif);

        // Đánh dấu đã đọc gọi API (nếu notif đó chưa đọc)
        if (!notif.isRead) {
            await markAsRead(notif._id);
        }
    };
    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle="light-content" backgroundColor={C.brandDark} />

            {/* ── Hero banner ── */}
            <View style={s.heroBanner}>
                <View style={s.bannerCircle1} />
                <View style={s.bannerCircle2} />

                {/* HÀNG TRÊN: Lời chào và Icon Thông báo */}
                <View style={s.headerTopRow}>
                    <Text style={s.bannerGreeting}>{greeting}</Text>

                    <TouchableOpacity
                        style={styles.bellButton}
                        onPress={() => setIsDropdownOpen(true)}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                        {unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                isDropdownOpen && (
                <NotificationDropdown
                    visible={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAllRead={markAllAsRead}
                    onNotificationClick={handleNotificationClick} // Truyền hàm xử lý vào
                />
                )

                {/* 2. Modal Detail (Xem chi tiết 1 thông báo) */}
                {selectedNotif && (
                    <NotificationDetailModal
                        visible={!!selectedNotif} // Có data là true (mở), null là false (đóng)
                        notification={selectedNotif}
                        onClose={() => setSelectedNotif(null)} // Đóng modal bằng cách set về null
                    />
                )}
                {/* HÀNG DƯỚI: Info người dùng */}
                <View style={s.bannerRow}>
                    <View style={s.bannerLeft}>
                        <Text style={s.bannerName}>{shortName}</Text>
                        <View style={s.levelBadge}>
                            <Ionicons name="star" size={11} color="#FBBF24" />
                            <Text style={s.levelText}>Lv.{level} · {levelLabel}</Text>
                        </View>
                    </View>
                    <View style={s.bannerRight}>
                        <UserAvatar
                            avatarUrl={profile?.avatarUrl}
                            initials={initials}
                            size={52}
                            bg="#C0DD97"
                            textColor={C.brandDark}
                            borderColor="rgba(255,255,255,0.6)"
                        />
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
                        onRefresh={onRefreshAll}
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

                {/* ── Dictation card ── */}
                <TouchableOpacity
                    style={[s.dictationCard, shadow.orange as any]}
                    activeOpacity={0.7}
                    onPress={() => router.push('/tabs/dictation' as any)}
                >
                    <View style={s.dictationBlob1} />
                    <View style={s.dictationBlob2} />
                    <View style={s.dictationRow}>
                        <View style={s.dictationLeft}>
                            <View style={s.dictationBadge}>
                                <Text style={s.dictationBadgeText}>🎧 Nghe Chính Tả</Text>
                            </View>
                            <Text style={s.dictationTitle}>Tăng phản xạ{'\n'}Nghe · Viết</Text>
                            <Text style={s.dictationDesc}>AI bóc băng tiếng Việt từng câu, so khớp và sửa lỗi chi tiết</Text>
                            <View style={s.dictationBtn}>
                                <Text style={s.dictationBtnText}>Luyện nghe</Text>
                                <Ionicons name="arrow-forward" size={13} color={C.orange} />
                            </View>
                        </View>
                        <View style={s.dictationIconWrap}>
                            <View style={s.dictationRing3} />
                            <View style={s.dictationRing2} />
                            <View style={s.dictationRing1} />
                            <View style={s.dictationCore}>
                                <Ionicons name="headset" size={26} color={C.orange} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

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

                {/* ── Leaderboard ── */}
                <LeaderboardSection />

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

                {/* ── Testimonials ── */}
                <TestimonialsSection />

                <View style={{ height: SP.xl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.bg },

    heroBanner:     { backgroundColor: C.brandDark, overflow: 'hidden', paddingHorizontal: SP.md, paddingTop: SP.md, paddingBottom: SP.lg + 4 },
    bannerCircle1:  { position: 'absolute', width: 160, height: 160, borderRadius: 80,  backgroundColor: '#4A8020', opacity: 0.45, right: -40, top: -50 },
    bannerCircle2:  { position: 'absolute', width: 100, height: 100, borderRadius: 50,  backgroundColor: '#6AAD30', opacity: 0.25, left: -20, bottom: -30 },

    // Header Row mới thêm
    headerTopRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    bannerGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500', letterSpacing: 0.3 },
    notificationBtn:{ position: 'relative', padding: 4 },
    notificationBadge: {
        position: 'absolute',
        top: 2, right: 2,
        backgroundColor: '#EF4444',
        minWidth: 16, height: 16,
        borderRadius: 8,
        justifyContent: 'center', alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5, borderColor: C.brandDark
    },
    notificationBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },

    bannerRow:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    bannerLeft:     { flex: 1, paddingRight: SP.sm },
    bannerName:     { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
    levelBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    levelText:      { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
    bannerRight:    { alignItems: 'center', gap: SP.xs },
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

    sectionLabel: { fontSize: 11, fontWeight: '600', color: C.muted, letterSpacing: 0.8, marginBottom: SP.sm },

    gridRow:     { flexDirection: 'row', gap: SP.sm, marginBottom: SP.sm },
    card:        { flex: 1, backgroundColor: C.surface, borderRadius: 20, padding: SP.md, justifyContent: 'space-between' },
    iconBox:     { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    cardTitle:   { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 4 },
    cardDesc:    { fontSize: 12, color: C.muted, lineHeight: 18, marginBottom: 16, minHeight: 36 },
    cardBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, overflow: 'hidden' },
    cardBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

    dictationCard:      { backgroundColor: C.orangeLight, borderRadius: 24, padding: SP.md, overflow: 'hidden', marginBottom: SP.sm },
    dictationBlob1:     { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: C.orange, opacity: 0.08, right: -30, top: -40 },
    dictationBlob2:     { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: C.orange, opacity: 0.08, left: -20, bottom: -20 },
    dictationRow:       { flexDirection: 'row', alignItems: 'center' },
    dictationLeft:      { flex: 1, paddingRight: SP.sm },
    dictationBadge:     { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
    dictationBadgeText: { fontSize: 10, fontWeight: '700', color: C.orange },
    dictationTitle:     { fontSize: 18, fontWeight: '800', color: '#9A3412', marginBottom: 6, lineHeight: 22 },
    dictationDesc:      { fontSize: 12, color: '#C2410C', lineHeight: 18, marginBottom: 12 },
    dictationBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
    dictationBtnText:   { fontSize: 13, fontWeight: '700', color: C.orange },
    dictationIconWrap:  { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
    dictationRing3:     { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: C.orange, opacity: 0.1 },
    dictationRing2:     { position: 'absolute', width: 54, height: 54, borderRadius: 27, backgroundColor: C.orange, opacity: 0.2 },
    dictationRing1:     { position: 'absolute', width: 38, height: 38, borderRadius: 19, backgroundColor: C.orange, opacity: 0.3 },
    dictationCore:      { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },

    heroCard:     { backgroundColor: C.purple, borderRadius: 24, padding: SP.md, overflow: 'hidden', marginBottom: SP.lg },
    heroBlobA:    { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#9333EA', opacity: 0.8, right: -40, top: -40 },
    heroBlobB:    { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: '#6B21A8', opacity: 0.6, left: -20, bottom: -30 },
    aiBadge:      { position: 'absolute', top: SP.md, right: SP.md, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    aiBadgeText:  { fontSize: 10, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
    heroCardRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    heroCardLeft: { flex: 1, paddingRight: SP.sm },
    heroCardTitle:{ fontSize: 20, fontWeight: '900', color: '#FFF', marginBottom: 4 },
    heroCardDesc: { fontSize: 13, color: C.purpleLight, opacity: 0.9, lineHeight: 18, marginBottom: 16 },
    heroCardBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
    heroCardBtnText: { fontSize: 14, fontWeight: '800', color: C.purple },
    micWrap:      { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
    micRing3:     { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', opacity: 0.1 },
    micRing2:     { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', opacity: 0.2 },
    micRing1:     { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', opacity: 0.3 },
    micCore:      { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },

    lbContainer:  { backgroundColor: C.surface, borderRadius: 24, padding: SP.md, marginBottom: SP.lg },
    lbHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SP.md },
    lbTitle:      { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 2 },
    lbSubtitle:   { fontSize: 12, color: C.muted },
    lbTabBar:     { flexDirection: 'row', backgroundColor: C.mutedLight, borderRadius: 12, marginBottom: SP.md },
    lbTab:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
    lbTabActive:  { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    lbTabText:    { fontSize: 13, fontWeight: '700', color: C.muted },
    myRankBadge:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECFDF5', paddingVertical: 8, borderRadius: 12, marginBottom: SP.md, gap: 4 },
    myRankText:   { fontSize: 12, color: '#047857', fontWeight: '600' },
    myRankNum:    { fontSize: 14, color: '#047857', fontWeight: '800' },
    lbLoading:    { height: 100, alignItems: 'center', justifyContent: 'center' },
    lbEmpty:      { height: 120, alignItems: 'center', justifyContent: 'center', gap: 8 },
    lbEmptyText:  { fontSize: 13, color: C.muted },
    podiumRow:    { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: SP.lg, marginTop: SP.sm, paddingHorizontal: 10 },
    podiumItem:   { alignItems: 'center' },
    podiumCrown:  { fontSize: 24, marginBottom: 4 },
    podiumAvatarWrap: { marginBottom: 8, zIndex: 2 },
    podiumRankBadge: { position: 'absolute', top: -10, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF', zIndex: 3 },
    podiumRankBadgeText: { fontSize: 10, fontWeight: '800' },
    podiumName:   { fontWeight: '700', color: C.text, marginBottom: 2, textAlign: 'center' },
    podiumMeBadge:{ backgroundColor: C.brandLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginBottom: 4 },
    podiumMeText: { fontSize: 9, fontWeight: '800', color: C.brandDark },
    podiumValue:  { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 8 },
    podiumValueText: { fontSize: 12, fontWeight: '800' },
    podiumUnit:   { fontSize: 10, color: C.muted, fontWeight: '600' },
    podiumBlock:  { width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 1, borderBottomWidth: 0, alignItems: 'center', paddingTop: SP.sm },
    podiumBlockNum: { fontSize: 32, fontWeight: '900', color: '#FCD34D', opacity: 0.5 },
    restList:     { gap: SP.sm },
    restRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: SP.sm, borderRadius: 16, gap: SP.sm },
    restRowMe:    { backgroundColor: C.brandLight, borderWidth: 1, borderColor: '#D9F99D' },
    restRank:     { width: 24, textAlign: 'center', fontSize: 14, fontWeight: '700', color: C.muted },
    restInfo:     { flex: 1, justifyContent: 'center' },
    restNameRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
    restName:     { fontSize: 14, fontWeight: '700', color: C.text, flexShrink: 1 },
    meBadge:      { backgroundColor: C.brand, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    meBadgeText:  { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
    restLevel:    { fontSize: 11, color: C.muted },
    restValueRow: { alignItems: 'flex-end', justifyContent: 'center' },
    restValue:    { fontSize: 14, fontWeight: '800', color: C.text },
    restUnit:     { fontSize: 10, color: C.muted, fontWeight: '600' },

    whyScroll:    { paddingBottom: SP.md, gap: SP.sm },
    whyCard:      { width: width * 0.44, backgroundColor: C.surface, borderRadius: 20, padding: SP.md },
    whyIconBox:   { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    whyKeyword:   { fontSize: 14, fontWeight: '800', marginBottom: 4 },
    whySub:       { fontSize: 12, color: C.muted, lineHeight: 18 },

    testimonialContainer: { marginBottom: SP.lg },
    testimonialTitle:     { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: SP.sm, paddingHorizontal: SP.xs },
    testimonialScroll:    { paddingBottom: SP.md, gap: SP.sm },
    testimonialCard:      { width: width * 0.75, backgroundColor: C.surface, borderRadius: 20, padding: SP.md },
    testimonialAvatar:    { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    testimonialAvatarText:{ fontSize: 14, fontWeight: '800' },
    testimonialStars:     { color: '#FBBF24', fontSize: 14, marginBottom: 8, letterSpacing: 2 },
    testimonialQuote:     { fontSize: 14, color: C.text, fontStyle: 'italic', lineHeight: 20, marginBottom: 12 },
    testimonialName:      { fontSize: 12, fontWeight: '700', color: C.muted },
});
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50, // Căn theo tai thỏ/status bar
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    headerText: { fontSize: 20, fontWeight: 'bold' },
    bellButton: { position: 'relative', padding: 5 },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});
