import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { useQuizFilter }   from '@/src/hooks/useQuizFilter';
import { SORT_OPTIONS, LEVEL_OPTIONS } from '@/src/constants/quiz.constants';
import SearchBar      from '../../src/components/ui/SearchBar';
import FilterDropdown from '../../src/components/ui/FilterDropdown';
import QuizCard       from '../../src/components/quiz/QuizCard';
import EmptyState     from '../../src/components/ui/EmptyState';

export default function QuizScreen() {
    const router = useRouter();
    const {
        search, setSearch,
        level,  setLevel,
        sortBy, setSortBy,
        showLevelMenu, setShowLevelMenu,
        showSortMenu,  setShowSortMenu,
        closeMenus,
        filtered,
    } = useQuizFilter();

    const currentLevel = LEVEL_OPTIONS.find(o => o.value === level)?.label ?? 'Cấp độ';
    const currentSort  = SORT_OPTIONS.find(o => o.value === sortBy)?.label  ?? 'Sắp xếp';

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
                <View className="mb-5">
                    <Text className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-1">
                        Thư viện Quiz
                    </Text>
                    <Text className="text-[13px] text-gray-400">
                        Rèn luyện kiến thức với {filtered.length} bài kiểm tra có sẵn.
                    </Text>
                </View>

                {/* ── Search ── */}
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Tìm kiếm bài quiz..."
                    onFocus={closeMenus}
                />

                {/* ── Filters ── */}
                <View className="flex-row gap-2.5 mb-4 z-10">
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
                </View>

                {/* ── Divider ── */}
                <View className="h-px bg-gray-200 mb-4" />

                {/* ── List ── */}
                {filtered.length === 0 ? (
                    <EmptyState icon="document-text-outline" message="Không tìm thấy bài quiz phù hợp." />
                ) : (
                    filtered.map(quiz => (
                        <QuizCard
                            key={quiz.id}
                            quiz={quiz}
                            onPress={(id) => {
                                closeMenus();
                                router.push(`/quiz/${id}` as any);
                            }}
                        />
                    ))
                )}

                <View className="h-5" />
            </ScrollView>
        </SafeAreaView>
    );
}
