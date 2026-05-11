// app/tabs/pronunciation.tsx
import React from 'react';
import {
    ScrollView, View, Text, StatusBar,
    ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';
import { Ionicons }     from '@expo/vector-icons';

import { usePronunciationFilter } from '@/src/hooks/usePronunciationFilter';
import { SORT_OPTIONS }           from '@/src/constants/pronunciation.constants';
import SearchBar                  from '../../src/components/ui/SearchBar';
import FilterDropdown             from '../../src/components/ui/FilterDropdown';
import TopicCard                  from '../../src/components/pronunciation/TopicCard';
import EmptyState                 from '../../src/components/ui/EmptyState';

const LEVEL_OPTIONS = [
    { value: 'all', label: 'Tất cả' },
    { value: '1',   label: 'Level 1' },
    { value: '2',   label: 'Level 2' },
    { value: '3',   label: 'Level 3' },
];

export default function PronunciationScreen() {
    const router = useRouter();
    const {
        search, setSearch,
        level,  setLevel,
        sortBy, setSortBy,
        showLevelMenu, setShowLevelMenu,
        showSortMenu,  setShowSortMenu,
        closeMenus,
        filtered,
        loading,
        error,
        refreshing,
        refresh,
    } = usePronunciationFilter();

    const currentLevel = LEVEL_OPTIONS.find(o => o.value === level)?.label ?? 'Cấp độ';
    const currentSort  = SORT_OPTIONS.find(o => o.value === sortBy)?.label  ?? 'Sắp xếp';

    const handleStart = (topicName: string) => {
        closeMenus();
        // Truyền tên topic qua route — decode ở màn hình detail
        router.push(`/pronunciation/${encodeURIComponent(topicName)}` as any);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={closeMenus}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={['#A855F7']}
                        tintColor="#A855F7"
                    />
                }
            >
                {/* ── Header ── */}
                <View className="mb-5">
                    <Text className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-1">
                        Luyện tập phát âm
                    </Text>
                    <Text className="text-[13px] text-gray-400 leading-5">
                        {loading
                            ? 'Đang tải...'
                            : `${filtered.length} chủ đề · Công nghệ AI tiên tiến`
                        }
                    </Text>
                </View>

                {/* ── Search ── */}
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Tìm kiếm chủ đề..."
                    onFocus={closeMenus}
                />

                {/* ── Filters ── */}
                <View className="flex-row items-center gap-2 mb-3.5 z-10">
                    <FilterDropdown
                        label={currentLevel}
                        options={LEVEL_OPTIONS}
                        selected={level}
                        isOpen={showLevelMenu}
                        onToggle={() => { setShowLevelMenu(!showLevelMenu); setShowSortMenu(false); }}
                        onSelect={(v) => { setLevel(v); setShowLevelMenu(false); }}
                    />
                    <FilterDropdown
                        label={currentSort}
                        options={SORT_OPTIONS}
                        selected={sortBy}
                        isOpen={showSortMenu}
                        alignRight
                        showIcon
                        onToggle={() => { setShowSortMenu(!showSortMenu); setShowLevelMenu(false); }}
                        onSelect={(v) => { setSortBy(v as any); setShowSortMenu(false); }}
                    />

                    {/* AI badge */}
                    <View className="flex-row items-center gap-1 ml-auto bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                        <Ionicons name="sparkles" size={11} color="#A855F7" />
                        <Text className="text-[11px] font-bold text-purple-800">AI</Text>
                    </View>
                </View>

                {/* ── Divider ── */}
                <View className="h-px bg-gray-200 mb-4" />

                {/* ── Loading ── */}
                {loading && (
                    <View className="items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#A855F7" />
                        <Text className="text-gray-400 text-[13px] mt-3">Đang tải chủ đề...</Text>
                    </View>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <EmptyState icon="wifi-outline" message={error} />
                )}

                {/* ── Topic Grid ── */}
                {!loading && !error && (
                    filtered.length === 0
                        ? <EmptyState icon="mic-off-outline" message="Không tìm thấy chủ đề phù hợp." />
                        : (
                            <View className="flex-row flex-wrap justify-between">
                                {filtered.map(topic => (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        onPress={handleStart}
                                    />
                                ))}
                            </View>
                        )
                )}

                <View className="h-5" />
            </ScrollView>
        </SafeAreaView>
    );
}
