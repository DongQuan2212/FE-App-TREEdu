import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 20 * 2 - 12) / 2;

const FEATURES = [
    {
        id: 'quiz',
        icon: 'grid-outline' as const,
        iconBg: '#22C55E',
        label: 'Bài Quiz',
        desc: 'Ôn luyện đa dạng\nvới chấm điểm tự động',
        btnText: 'Làm ngay',
        btnColor: '#22C55E',
        route: '/(tabs)/quiz',
    },
    {
        id: 'flashcard',
        icon: 'layers-outline' as const,
        iconBg: '#3B82F6',
        label: 'Flashcard',
        desc: 'Ghi nhớ từ vựng\ntheo chu kỳ lặp lại',
        btnText: 'Tạo bộ từ',
        btnColor: '#3B82F6',
        route: '/(tabs)/flashcard',
    },
    {
        id: 'pronunciation',
        icon: 'mic-outline' as const,
        iconBg: '#A855F7',
        label: 'Phát Âm AI',
        desc: 'Luyện nói chuẩn\nnhận điểm tức thì',
        btnText: 'Luyện nói',
        btnColor: '#A855F7',
        route: '/(tabs)/pronunciation',
    },
];

// ── 3 section giới thiệu (từ IntroPage web) ───────────────
const INTRO_SECTIONS = [
    {
        id: 'learn',
        icon: 'book-outline' as const,
        iconBg: '#EEF7E6',
        iconColor: '#609A47',
        title: 'Hãy học theo cách bạn thích',
        desc: 'TREEdu kết hợp flashcard sinh động, quiz thú vị và lớp học ảo để bạn luyện phát âm chuẩn như người bản xứ. Vừa học, vừa chơi, vừa tiến bộ mỗi ngày.',
    },
    {
        id: 'resource',
        icon: 'library-outline' as const,
        iconBg: '#EEF2FF',
        iconColor: '#4F6CDD',
        title: 'Nguồn tài liệu phong phú',
        desc: 'Kho tài liệu phong phú giúp bạn luyện tập mọi kỹ năng: từ từ vựng, ngữ pháp đến phát âm — tất cả trong một nơi.',
    },
    {
        id: 'anytime',
        icon: 'time-outline' as const,
        iconBg: '#FFF7ED',
        iconColor: '#D97706',
        title: 'Học mọi lúc mọi nơi',
        desc: 'Không cần giờ giấc cố định. TREEdu giúp bạn học linh hoạt mọi lúc, mọi nơi — chỉ cần có điện thoại là đủ.',
    },
];

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />



            {/* ── Scroll ── */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Hero ── */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>
                        Bạn sẽ học được gì{'\n'}trên{' '}
                        <Text style={styles.heroAccent}>TREEdu</Text>?
                    </Text>
                    <Text style={styles.heroSub}>
                        Luyện học Tiếng Việt chưa bao giờ dễ đến vậy
                    </Text>
                </View>

                {/* ── Feature Cards ── */}
                {/* Hàng 1: Quiz + Flashcard */}
                <View style={styles.gridRow}>
                    {FEATURES.slice(0, 2).map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            activeOpacity={0.88}
                            onPress={() => router.push(item.route as any)}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                                <Ionicons name={item.icon} size={26} color="#FFFFFF" />
                            </View>
                            <Text style={styles.cardTitle}>{item.label}</Text>
                            <Text style={styles.cardDesc}>{item.desc}</Text>
                            <TouchableOpacity
                                style={[styles.cardBtn, { backgroundColor: item.btnColor }]}
                                activeOpacity={0.85}
                                onPress={() => router.push(item.route as any)}
                            >
                                <Text style={styles.cardBtnText}>{item.btnText} →</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Hàng 2: Phát Âm AI — full width nằm ngang */}
                <TouchableOpacity
                    style={styles.cardWide}
                    activeOpacity={0.88}
                    onPress={() => router.push(FEATURES[2].route as any)}
                >
                    <View style={styles.cardWideInner}>
                        <View style={[styles.iconCircleLarge, { backgroundColor: FEATURES[2].iconBg }]}>
                            <Ionicons name={FEATURES[2].icon} size={30} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardWideText}>
                            <Text style={styles.cardTitle}>{FEATURES[2].label}</Text>
                            <Text style={[styles.cardDesc, { marginBottom: 0 }]}>
                                {FEATURES[2].desc}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.cardBtnWide, { backgroundColor: FEATURES[2].btnColor }]}
                        activeOpacity={0.85}
                        onPress={() => router.push(FEATURES[2].route as any)}
                    >
                        <Text style={styles.cardBtnText}>{FEATURES[2].btnText} →</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* ── Divider ── */}
                <View style={styles.sectionDivider} />

                {/* ── Tiêu đề giới thiệu ── */}
                <Text style={styles.introHeading}>Tại sao chọn TREEdu?</Text>

                {/* ── Intro Sections ── */}
                {INTRO_SECTIONS.map((section, index) => (
                    <View key={section.id}>
                        <View style={styles.introCard}>
                            <View style={[styles.introIconWrap, { backgroundColor: section.iconBg }]}>
                                <Ionicons name={section.icon} size={28} color={section.iconColor} />
                            </View>
                            <View style={styles.introTextWrap}>
                                <Text style={[styles.introTitle, { color: section.iconColor }]}>
                                    {section.title}
                                </Text>
                                <Text style={styles.introDesc}>{section.desc}</Text>
                            </View>
                        </View>
                        {index < INTRO_SECTIONS.length - 1 && (
                            <View style={styles.introDivider} />
                        )}
                    </View>
                ))}

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAF7',
    },

    // ── Header ──────────────────────────────────────────────
    appHeader: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 150,
        height: 75,
    },
    headerDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },

    // ── Scroll ──────────────────────────────────────────────
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 28,
    },

    // ── Hero ────────────────────────────────────────────────
    hero: { marginBottom: 24 },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111111',
        lineHeight: 40,
        marginBottom: 8,
    },
    heroAccent: { color: '#7CB342' },
    heroSub: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
    },

    // ── Hàng 1: 2 card vuông ────────────────────────────────
    gridRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111111',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 16,
        flex: 1,
    },
    cardBtn: {
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },

    // ── Hàng 2: 1 card ngang full width ─────────────────────
    cardWide: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    cardWideInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    iconCircleLarge: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    cardWideText: { flex: 1 },
    cardBtnWide: {
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── Divider giữa cards và intro ──────────────────────────
    sectionDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 28,
    },

    // ── Tiêu đề phần giới thiệu ─────────────────────────────
    introHeading: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111111',
        marginBottom: 20,
    },

    // ── Intro Sections ───────────────────────────────────────
    introCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        paddingVertical: 4,
    },
    introIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    introTextWrap: { flex: 1 },
    introTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
        lineHeight: 22,
    },
    introDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    introDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 18,
    },
});
