import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, TextInput, Image,
    Pressable, ActivityIndicator, SafeAreaView, StatusBar, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllDictationApi } from '../../src/constants/dictationAPI';
import type { Dictation } from '../../src/types/dictation.types';
const getCloudinaryThumbnail = (audioUrl: string) => {
    if (!audioUrl || !audioUrl.includes('cloudinary.com')) return null;
    return audioUrl
        .replace('/video/upload/', '/video/upload/so_0,w_400,h_225,c_fill/')
        .replace('.mp4', '.jpg')
        .replace('.mp3', '.jpg');
};

const LevelBadge = ({ level }: { level: string }) => {
    const badgeStyles: Record<string, string> = {
        A1: 'border-green-200 bg-green-50 text-green-700',
        A2: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        B1: 'border-yellow-200 bg-yellow-50 text-yellow-700',
        B2: 'border-orange-200 bg-orange-50 text-orange-700',
        C1: 'border-red-200 bg-red-50 text-red-700',
        C2: 'border-purple-200 bg-purple-50 text-purple-700',
    };
    return (
        <View className={`px-2 py-0.5 border text-center rounded-md ${badgeStyles[level] || 'border-zinc-200 bg-zinc-50 text-zinc-600'}`}>
            <Text className="text-[10px] font-bold uppercase tracking-wider">{level}</Text>
        </View>
    );
};

export default function DictationTabScreen() {
    const router = useRouter();
    const [dictations, setDictations] = useState<Dictation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Gọi hàm trực tiếp theo chuẩn mới
            const resData = await getAllDictationApi();
            setDictations(resData || []);
        } catch (err) {
            setError('Không thể tải danh sách bài nghe.');
        } finally {
            setLoading(false);
        }
    };
    const filteredData = dictations.filter(d => {
        const matchSearch = (d.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchLevel = selectedLevel === 'all' || d.level === selectedLevel;
        return matchSearch && matchLevel;
    });

    if (loading) {
        return (
            <View className="flex-1 bg-zinc-50 justify-center items-center">
                <ActivityIndicator size="large" color="#7CB342" />
                <Text className="text-zinc-500 text-sm mt-3 font-medium">Đang tải bài học...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-50">
            <StatusBar barStyle="dark-content" />

            {/* Top Navigation */}
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-zinc-200">
                <Pressable onPress={() => router.back()} className="p-1 -ml-1 rounded-full active:bg-zinc-100">
                    <Ionicons name="arrow-back" size={24} color="#18181B" />
                </Pressable>
                <Text className="text-lg font-bold text-zinc-900 ml-3 flex-1">Nghe chép chính tả</Text>
            </View>

            {/* Filter Section */}
            <View className="p-4 bg-white border-b border-zinc-200 space-y-3">
                <View className="flex-row items-center bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2">
                    <Ionicons name="search-outline" size={18} color="#71717A" />
                    <TextInput
                        placeholder="Tìm kiếm bài nghe..."
                        placeholderTextColor="#a1a1aa"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        className="flex-1 ml-2 text-sm text-zinc-900 p-0"
                    />
                </View>

                <View className="pt-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                            <Pressable
                                key={lvl}
                                onPress={() => setSelectedLevel(lvl)}
                                className={`px-4 py-1.5 rounded-full mr-2 border ${selectedLevel === lvl ? 'bg-zinc-900 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}
                            >
                                <Text className={`text-xs font-semibold ${selectedLevel === lvl ? 'text-white' : 'text-zinc-600'}`}>
                                    {lvl === 'all' ? 'Tất cả' : lvl}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* List Cards */}
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => {
                    const thumbnail = getCloudinaryThumbnail(item.audioUrl);
                    return (
                        <Pressable
                            onPress={() => router.push(`/dictation/${item.id}` as any)}                            className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-4 active:opacity-95 shadow-sm"
                        >
                            <View className="h-32 w-full bg-zinc-100 relative">
                                {thumbnail ? (
                                    <Image source={{ uri: thumbnail }} className="w-full h-full object-cover" />
                                ) : (
                                    <View className="w-full h-full bg-zinc-800 items-center justify-center">
                                        <Ionicons name="musical-notes-outline" size={32} color="#A1A1AA" />
                                    </View>
                                )}
                                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                                    <View className="w-10 h-10 rounded-full bg-white/95 items-center justify-center shadow">
                                        <Ionicons name="play" size={18} color="#18181B" className="ml-0.5" />
                                    </View>
                                </View>
                                <View className="absolute top-2 right-2">
                                    <LevelBadge level={item.level} />
                                </View>
                            </View>

                            <View className="p-4">
                                <Text numberOfLines={2} className="text-base font-bold text-zinc-900 mb-2 leading-snug">
                                    {item.title}
                                </Text>
                                <View className="flex-row items-center mt-1">
                                    <Ionicons name="book-outline" size={14} color="#71717A" />
                                    <Text className="text-xs text-zinc-500 font-medium ml-1">{item.segments?.length || 0} đoạn</Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                }}
            />
        </SafeAreaView>
    );
}
