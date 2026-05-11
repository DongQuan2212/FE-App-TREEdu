// app/pronunciation/[topic].tsx
//
// Màn hình luyện phát âm theo topic.
// Flow: load câu ngẫu nhiên → ghi âm → AI chấm → hiển thị kết quả
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView }            from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons }                from '@expo/vector-icons';
import { usePronunciationPractice } from '@/src/hooks/usePronunciationPractice';

export default function PronunciationDetailScreen() {
    const { topic } = useLocalSearchParams<{ topic: string }>();
    const router     = useRouter();
    const topicName  = decodeURIComponent(topic ?? '');

    const {
        sentence, loadingSentence, sentenceError, loadSentence,
        recording, processing, toggleRecording,
        result, resultError,
    } = usePronunciationPractice(topicName);

    const score = result?.pronunciationScore ?? 0;

    const scoreColor = score >= 80 ? '#16A34A'
        : score >= 60              ? '#D97706'
            :                           '#DC2626';

    const scoreBg = score >= 80 ? '#F0FDF4'
        : score >= 60            ? '#FFFBEB'
            :                         '#FFF1F2';

    return (
        <SafeAreaView className="flex-1 bg-[#FAFAFA]">
            <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <View className="flex-row items-center gap-3 mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={18} color="#374151" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-[18px] font-extrabold text-gray-900" numberOfLines={1}>
                            {topicName}
                        </Text>
                        <Text className="text-[12px] text-gray-400">Luyện phát âm với AI</Text>
                    </View>
                    {/* AI badge */}
                    <View className="flex-row items-center gap-1 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                        <Ionicons name="sparkles" size={11} color="#A855F7" />
                        <Text className="text-[11px] font-bold text-purple-800">AI</Text>
                    </View>
                </View>

                {/* ── Câu cần đọc ── */}
                <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons name="volume-high-outline" size={16} color="#6B7280" />
                        <Text className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                            Câu cần luyện
                        </Text>
                    </View>

                    {loadingSentence ? (
                        <View className="h-10 justify-center">
                            <ActivityIndicator size="small" color="#A855F7" />
                        </View>
                    ) : sentenceError ? (
                        <Text className="text-red-500 text-sm">{sentenceError}</Text>
                    ) : (
                        <Text className="text-[22px] font-bold text-gray-900 leading-8 mb-4">
                            {'"'}{sentence}{'"'}
                        </Text>
                    )}

                    {/* Nút câu tiếp theo */}
                    <TouchableOpacity
                        className="flex-row items-center gap-1.5 self-start"
                        onPress={loadSentence}
                        disabled={loadingSentence || recording}
                    >
                        <Ionicons name="refresh-outline" size={14} color="#A855F7" />
                        <Text className="text-[13px] font-semibold text-purple-600">
                            Câu khác
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ── Nút ghi âm ── */}
                <View className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 items-center">

                    {/* Vòng tròn ghi âm */}
                    <TouchableOpacity
                        onPress={toggleRecording}
                        disabled={loadingSentence || processing || !!sentenceError}
                        activeOpacity={0.85}
                        style={{
                            width:           80,
                            height:          80,
                            borderRadius:    40,
                            backgroundColor: recording ? '#EF4444' : '#F3E8FF',
                            borderWidth:     3,
                            borderColor:     recording ? '#DC2626' : '#D8B4FE',
                            alignItems:      'center',
                            justifyContent:  'center',
                            marginBottom:    16,
                            opacity: (loadingSentence || processing || !!sentenceError) ? 0.5 : 1,
                        }}
                    >
                        <Ionicons
                            name={recording ? 'stop' : 'mic'}
                            size={34}
                            color={recording ? '#FFFFFF' : '#7E22CE'}
                        />
                    </TouchableOpacity>

                    {/* Status text */}
                    {processing ? (
                        <View className="items-center gap-2">
                            <ActivityIndicator size="small" color="#A855F7" />
                            <Text className="text-[13px] text-gray-400">
                                AI đang phân tích phát âm...
                            </Text>
                        </View>
                    ) : recording ? (
                        <View className="items-center gap-1">
                            <View className="flex-row items-center gap-1.5">
                                <View className="w-2 h-2 rounded-full bg-red-500" />
                                <Text className="text-[14px] font-semibold text-red-500">
                                    Đang ghi âm...
                                </Text>
                            </View>
                            <Text className="text-[12px] text-gray-400">Nhấn để dừng</Text>
                        </View>
                    ) : result ? (
                        <Text className="text-[13px] text-green-600 font-semibold">
                            ✓ Đã phân tích xong
                        </Text>
                    ) : (
                        <View className="items-center gap-1">
                            <Text className="text-[14px] font-semibold text-gray-700">
                                Nhấn để ghi âm
                            </Text>
                            <Text className="text-[12px] text-gray-400">
                                Đọc to và rõ câu phía trên
                            </Text>
                        </View>
                    )}

                    {/* Error ghi âm */}
                    {resultError && (
                        <Text className="text-red-500 text-[12px] mt-3 text-center">
                            {resultError}
                        </Text>
                    )}
                </View>

                {/* ── Kết quả ── */}
                {result && (
                    <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
                        <Text className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            Kết quả phát âm
                        </Text>

                        {/* Score */}
                        <View className="items-center mb-5">
                            <View
                                className="w-24 h-24 rounded-full items-center justify-center mb-2"
                                style={{ backgroundColor: scoreBg }}
                            >
                                <Text className="text-3xl font-extrabold" style={{ color: scoreColor }}>
                                    {score}
                                </Text>
                                <Text className="text-[11px]" style={{ color: scoreColor }}>/100</Text>
                            </View>
                            <Text className="text-[13px] font-semibold" style={{ color: scoreColor }}>
                                {score >= 80 ? '🎉 Xuất sắc!' : score >= 60 ? '👍 Khá tốt' : '💪 Cần luyện thêm'}
                            </Text>
                        </View>

                        {/* Bạn nói */}
                        <View className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
                            <Text className="text-[11px] text-gray-400 mb-1">Bạn nói:</Text>
                            <Text className="text-[14px] font-semibold text-gray-700">
                                {'"'}{result.recognizedText}{'"'}
                            </Text>
                        </View>

                        {/* Lỗi phát âm */}
                        {result.pronunciationErrors?.length > 0 ? (
                            <View className="gap-2">
                                <Text className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    Lỗi phát âm
                                </Text>
                                {result.pronunciationErrors.map((err, i) => (
                                    <View
                                        key={i}
                                        className="bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                                    >
                                        <Text className="text-[13px] font-bold text-red-700 mb-1">
                                            "{err.original || '(thừa)'}" → "{err.recognized}"
                                        </Text>
                                        <Text className="text-[12px] text-red-600 leading-5">
                                            {err.explanation}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View className="bg-green-50 border border-green-100 rounded-xl px-4 py-4 items-center">
                                <Text className="text-xl font-bold text-green-700 mb-1">Xuất sắc! 🎉</Text>
                                <Text className="text-[13px] text-green-600">Phát âm rất chuẩn!</Text>
                            </View>
                        )}

                        {/* Luyện câu mới */}
                        <TouchableOpacity
                            className="flex-row items-center justify-center gap-2 mt-4 h-[48px] border border-gray-200 rounded-2xl"
                            activeOpacity={0.85}
                            onPress={loadSentence}
                        >
                            <Ionicons name="refresh-outline" size={16} color="#374151" />
                            <Text className="text-[14px] font-semibold text-gray-700">Luyện câu mới</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
