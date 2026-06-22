import React, { useState } from 'react';
import {
    View, Text, ScrollView, StatusBar, TouchableOpacity,
    ActivityIndicator, RefreshControl, Modal,
    TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useFlashcardFilter }                                       from '@/src/hooks/useFlashcardFilter';
import { SORT_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS,
    VISIBILITY_OPTIONS }                                        from '@/src/constants/flashcard.constants';
import { reportFlashcardApi } from '@/src/constants/flashcardApi';
import { Flashcard }                                                from '@/src/types/flashcard';
import SearchBar      from '../../src/components/ui/SearchBar';
import FilterDropdown from '../../src/components/ui/FilterDropdown';
import FlashcardCard  from '../../src/components/flashcard/FlashcardCard';
import CreateCard     from '../../src/components/flashcard/CreateCard';
import EmptyState     from '../../src/components/ui/EmptyState';

export default function FlashcardScreen() {
    const router = useRouter();

    const {
        search, setSearch,
        level,  setLevel,
        type,   setType,
        sortBy, setSortBy,
        showLevelMenu,      setShowLevelMenu,
        showTypeMenu,       setShowTypeMenu,
        showSortMenu,       setShowSortMenu,
        closeMenus,
        filtered,
        loading,
        error,
        refreshing,
        refresh,
    } = useFlashcardFilter();

    // ── Visibility filter (local, không cần hook) ──────────────────────────
    const [visibility,         setVisibility]         = useState('all');
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

    // ── Report modal ───────────────────────────────────────────────────────
    const [reportTarget,  setReportTarget]  = useState<Flashcard | null>(null);
    const [reportReason,  setReportReason]  = useState('');
    const [reportLoading, setReportLoading] = useState(false);

    const openReport  = (card: Flashcard) => { setReportTarget(card); setReportReason(''); };
    const closeReport = () => { setReportTarget(null); setReportReason(''); };

    const submitReport = async () => {
        if (!reportReason.trim()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập lý do báo cáo.');
            return;
        }
        if (!reportTarget) return;
        setReportLoading(true);
        try {
            await reportFlashcardApi(reportTarget.id, reportReason);
            closeReport();
            Alert.alert('Thành công', 'Báo cáo của bạn đã được ghi nhận.');
        } catch (err: any) {
            Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể gửi báo cáo.');
        } finally {
            setReportLoading(false);
        }
    };

    // ── Apply visibility filter on top of hook's filtered list ────────────
    const finalList = visibility === 'all'
        ? filtered
        : filtered.filter(c => c.visibility === visibility);

    // ── Label helpers ──────────────────────────────────────────────────────
    const currentLevel      = LEVEL_OPTIONS.find(o => o.value === level)?.label      ?? 'Cấp độ';
    const currentType       = TYPE_OPTIONS.find(o => o.value === type)?.label        ?? 'Loại thẻ';
    const currentSort       = SORT_OPTIONS.find(o => o.value === sortBy)?.label      ?? 'Sắp xếp';
    const currentVisibility = VISIBILITY_OPTIONS.find(o => o.value === visibility)?.label ?? 'Chế độ';

    const closeAllMenus = () => {
        closeMenus();
        setShowVisibilityMenu(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={closeAllMenus}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={['#7CB342']}
                        tintColor="#7CB342"
                    />
                }
            >
                {/* ── Header ── */}
                <View className="flex-row justify-between items-start mb-5">
                    <View>
                        <Text className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-1">
                            Thư viện Flashcard
                        </Text>
                        <Text className="text-[13px] text-gray-400">
                            {loading ? 'Đang tải...' : `${finalList.length} bộ thẻ từ vựng có sẵn.`}
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center gap-1.5 bg-[#7CB342] px-3.5 py-2.5 rounded-xl"
                        activeOpacity={0.85}
                        onPress={() => router.push('/flashcard/create' as any)}
                    >
                        <Ionicons name="add" size={18} color="#FFFFFF" />
                        <Text className="text-[13px] font-bold text-white">Tạo mới</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Search ── */}
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Tìm kiếm bộ thẻ..."
                    onFocus={closeAllMenus}
                />

                {/* ── Filters row 1: Level + Type + Sort ── */}
                <View className="flex-row gap-2 mb-2 z-20">
                    <FilterDropdown
                        label={currentLevel}
                        options={LEVEL_OPTIONS}
                        selected={level}
                        isOpen={showLevelMenu}
                        onToggle={() => { setShowLevelMenu(!showLevelMenu); setShowTypeMenu(false); setShowSortMenu(false); setShowVisibilityMenu(false); }}
                        onSelect={(v) => { setLevel(v); setShowLevelMenu(false); }}
                    />
                    <FilterDropdown
                        label={currentType}
                        options={TYPE_OPTIONS}
                        selected={type}
                        isOpen={showTypeMenu}
                        onToggle={() => { setShowTypeMenu(!showTypeMenu); setShowLevelMenu(false); setShowSortMenu(false); setShowVisibilityMenu(false); }}
                        onSelect={(v) => { setType(v as any); setShowTypeMenu(false); }}
                    />
                    <FilterDropdown
                        label={currentSort}
                        options={SORT_OPTIONS}
                        selected={sortBy}
                        isOpen={showSortMenu}
                        alignRight
                        showIcon
                        onToggle={() => { setShowSortMenu(!showSortMenu); setShowLevelMenu(false); setShowTypeMenu(false); setShowVisibilityMenu(false); }}
                        onSelect={(v) => { setSortBy(v as any); setShowSortMenu(false); }}
                    />
                </View>

                {/* ── Filters row 2: Visibility ── */}
                <View className="flex-row gap-2 mb-4 z-10">
                    <FilterDropdown
                        label={currentVisibility}
                        options={VISIBILITY_OPTIONS}
                        selected={visibility}
                        isOpen={showVisibilityMenu}
                        onToggle={() => { setShowVisibilityMenu(!showVisibilityMenu); closeMenus(); }}
                        onSelect={(v) => { setVisibility(v); setShowVisibilityMenu(false); }}
                    />
                </View>

                {/* ── Divider ── */}
                <View className="h-px bg-gray-200 mb-4" />

                {/* ── Loading ── */}
                {loading && (
                    <View className="items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#7CB342" />
                        <Text className="text-gray-400 text-[13px] mt-3">Đang tải danh sách flashcard...</Text>
                    </View>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <EmptyState icon="wifi-outline" message={error} />
                )}

                {/* ── Grid 2 cột ── */}
                {!loading && !error && (
                    finalList.length === 0 && type === 'SYSTEM' ? (
                        <EmptyState icon="layers-outline" message="Không tìm thấy bộ flashcard nào." />
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {type !== 'SYSTEM' && (
                                <CreateCard onPress={() => router.push('/flashcard/create' as any)} />
                            )}
                            {finalList.map(card => (
                                <FlashcardCard
                                    key={card.id}
                                    card={card}
                                    onPress={(id) => { closeAllMenus(); router.push(`/flashcard/${id}` as any); }}
                                    onReport={openReport}
                                />
                            ))}
                        </View>
                    )
                )}

                <View className="h-5" />
            </ScrollView>

            {/* ── Report Modal ── */}
            <Modal
                visible={!!reportTarget}
                transparent
                animationType="fade"
                onRequestClose={closeReport}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }}
                        activeOpacity={1}
                        onPress={closeReport}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24 }}
                            onPress={() => {}}
                        >
                            {/* Modal header */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827' }}>
                                    Báo cáo flashcard
                                </Text>
                                <TouchableOpacity onPress={closeReport} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                    <Ionicons name="close" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>

                            {/* Flashcard name */}
                            <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
                                Bộ thẻ:{' '}
                                <Text style={{ fontWeight: '700', color: '#374151' }}>
                                    {reportTarget?.title}
                                </Text>
                            </Text>

                            {/* Text input */}
                            <TextInput
                                value={reportReason}
                                onChangeText={setReportReason}
                                placeholder="Nhập lý do báo cáo..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={4}
                                style={{
                                    borderWidth: 1.5, borderColor: '#E5E7EB',
                                    borderRadius: 14, padding: 14,
                                    fontSize: 14, color: '#111827',
                                    textAlignVertical: 'top',
                                    minHeight: 110, marginBottom: 20,
                                    backgroundColor: '#FAFAFA',
                                }}
                            />

                            {/* Buttons */}
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={closeReport}
                                    style={{
                                        flex: 1, height: 48, borderRadius: 14,
                                        borderWidth: 1.5, borderColor: '#E5E7EB',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Hủy</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={submitReport}
                                    disabled={reportLoading}
                                    style={{
                                        flex: 1, height: 48, borderRadius: 14,
                                        backgroundColor: reportLoading ? '#FCA5A5' : '#EF4444',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}
                                    activeOpacity={0.85}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
                                        {reportLoading ? 'Đang gửi...' : 'Gửi báo cáo'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
