import React from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useFlashcardFilter }                        from '@/src/hooks/useFlashcardFilter';
import { SORT_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS } from '@/src/constants/flashcard.constants';
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
        showLevelMenu, setShowLevelMenu,
        showTypeMenu,  setShowTypeMenu,
        showSortMenu,  setShowSortMenu,
        closeMenus,
        filtered,
    } = useFlashcardFilter();

    const currentLevel = LEVEL_OPTIONS.find(o => o.value === level)?.label ?? 'Cấp độ';
    const currentType  = TYPE_OPTIONS.find(o => o.value === type)?.label   ?? 'Loại thẻ';
    const currentSort  = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sắp xếp';

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={closeMenus}
            >
                {/* ── Header ── */}
                <View className="flex-row justify-between items-start mb-5">
                    <View>
                        <Text className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-1">
                            Thư viện Flashcard
                        </Text>
                        <Text className="text-[13px] text-gray-400">
                            {filtered.length} bộ thẻ từ vựng có sẵn.
                        </Text>
                    </View>

                    {/* Nút tạo mới */}
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
                    onFocus={closeMenus}
                />

                {/* ── Filters ── */}
                <View className="flex-row gap-2 mb-4 z-10">
                    <FilterDropdown
                        label={currentLevel}
                        options={LEVEL_OPTIONS}
                        selected={level}
                        isOpen={showLevelMenu}
                        onToggle={() => { setShowLevelMenu(!showLevelMenu); setShowTypeMenu(false); setShowSortMenu(false); }}
                        onSelect={(v) => { setLevel(v); setShowLevelMenu(false); }}
                    />
                    <FilterDropdown
                        label={currentType}
                        options={TYPE_OPTIONS}
                        selected={type}
                        isOpen={showTypeMenu}
                        onToggle={() => { setShowTypeMenu(!showTypeMenu); setShowLevelMenu(false); setShowSortMenu(false); }}
                        onSelect={(v) => { setType(v as any); setShowTypeMenu(false); }}
                    />
                    <FilterDropdown
                        label={currentSort}
                        options={SORT_OPTIONS}
                        selected={sortBy}
                        isOpen={showSortMenu}
                        alignRight
                        showIcon
                        onToggle={() => { setShowSortMenu(!showSortMenu); setShowLevelMenu(false); setShowTypeMenu(false); }}
                        onSelect={(v) => { setSortBy(v as any); setShowSortMenu(false); }}
                    />
                </View>

                {/* ── Divider ── */}
                <View className="h-px bg-gray-200 mb-4" />

                {/* ── Grid 2 cột ── */}
                {filtered.length === 0 && type === 'SYSTEM' ? (
                    <EmptyState icon="layers-outline" message="Không tìm thấy bộ flashcard nào." />
                ) : (
                    <View className="flex-row flex-wrap justify-between">
                        {/* Card tạo mới — ẩn khi đang lọc SYSTEM */}
                        {type !== 'SYSTEM' && (
                            <CreateCard onPress={() => router.push('/flashcard/create' as any)} />
                        )}

                        {filtered.map(card => (
                            <FlashcardCard
                                key={card.id}
                                card={card}
                                onPress={(id) => {
                                    closeMenus();
                                    router.push(`/flashcard/detail/${id}` as any);
                                }}
                            />
                        ))}
                    </View>
                )}

                <View className="h-5" />
            </ScrollView>
        </SafeAreaView>
    );
}
