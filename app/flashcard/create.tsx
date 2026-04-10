import React from 'react';
import { AuthProvider } from '../../src/context/AuthContext';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, StatusBar, ActivityIndicator,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCreateFlashcard } from '../../src/hooks/useCreateFlashcard'
const LEVEL_OPTIONS = [1, 2, 3, 4, 5];

export default function CreateFlashcardScreen() {
    const router = useRouter();
    const {
        title,       setTitle,
        description, setDescription,
        topic,       setTopic,
        level,       setLevel,
        loading,
        errors,
        clearError,
        handleCreate,
    } = useCreateFlashcard();

    // ── Input helper ─────────────────────────────────────
    const fieldClass = (err?: string) =>
        `h-[50px] border rounded-xl px-4 text-sm text-gray-900 bg-white ${
            err ? 'border-red-400' : 'border-gray-200'
        }`;

    return (
        <AuthProvider>
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Back ── */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center gap-1.5 self-start mb-8"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={18} color="#6B7280" />
                        <Text className="text-sm font-medium text-gray-500">Quay lại</Text>
                    </TouchableOpacity>

                    {/* ── Header ── */}
                    <View className="mb-8">
                        <Text className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">
                            Tạo bộ thẻ mới
                        </Text>
                        <Text className="text-[15px] text-gray-400 font-light">
                            Thiết lập thông tin cơ bản cho bộ từ vựng của bạn.
                        </Text>
                    </View>

                    {/* ── Form ── */}
                    <View style={{ gap: 24 }}>

                        {/* Title */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Tên bộ thẻ</Text>
                            <TextInput
                                className={fieldClass(errors.title)}
                                placeholder="Ví dụ: 3000 từ vựng Oxford..."
                                placeholderTextColor="#D1D5DB"
                                value={title}
                                onChangeText={(v) => { setTitle(v); clearError('title'); }}
                            />
                            {errors.title ? (
                                <Text className="text-xs text-red-500 mt-1">{errors.title}</Text>
                            ) : null}
                        </View>

                        {/* Description */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Mô tả</Text>
                            <TextInput
                                className={`border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white ${
                                    errors.description ? 'border-red-400' : 'border-gray-200'
                                }`}
                                placeholder="Mô tả ngắn gọn về nội dung..."
                                placeholderTextColor="#D1D5DB"
                                value={description}
                                onChangeText={(v) => { setDescription(v); clearError('description'); }}
                                multiline
                                numberOfLines={3}
                                style={{ textAlignVertical: 'top', minHeight: 80 }}
                            />
                            {errors.description ? (
                                <Text className="text-xs text-red-500 mt-1">{errors.description}</Text>
                            ) : null}
                        </View>

                        {/* Topic + Level row */}
                        <View className="flex-row gap-4">
                            {/* Topic */}
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Chủ đề</Text>
                                <View className={`flex-row items-center h-[50px] border rounded-xl bg-white ${
                                    errors.topic ? 'border-red-400' : 'border-gray-200'
                                }`}>
                                    <View className="px-3">
                                        <Ionicons name="book-outline" size={16} color="#9CA3AF" />
                                    </View>
                                    <TextInput
                                        className="flex-1 text-sm text-gray-900 pr-3"
                                        placeholder="IELTS, Daily..."
                                        placeholderTextColor="#D1D5DB"
                                        value={topic}
                                        onChangeText={(v) => { setTopic(v); clearError('topic'); }}
                                    />
                                </View>
                                {errors.topic ? (
                                    <Text className="text-xs text-red-500 mt-1">{errors.topic}</Text>
                                ) : null}
                            </View>

                            {/* Level picker */}
                            <View style={{ width: 130 }}>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">Độ khó</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row gap-2">
                                        {LEVEL_OPTIONS.map(l => (
                                            <TouchableOpacity
                                                key={l}
                                                onPress={() => setLevel(l)}
                                                className={`w-[42px] h-[50px] rounded-xl border items-center justify-center ${
                                                    level === l
                                                        ? 'bg-gray-900 border-gray-900'
                                                        : 'bg-white border-gray-200'
                                                }`}
                                            >
                                                <Text className={`text-sm font-bold ${
                                                    level === l ? 'text-white' : 'text-gray-500'
                                                }`}>
                                                    {l}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        {/* Info box */}
                        <View className="flex-row gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                            <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" style={{ flexShrink: 0, marginTop: 1 }} />
                            <View style={{ gap: 4 }}>
                                <Text className="text-sm text-gray-500">• Hãy chọn tiêu đề ngắn gọn.</Text>
                                <Text className="text-sm text-gray-500">• Phân loại Level chính xác giúp hệ thống gợi ý tốt hơn.</Text>
                            </View>
                        </View>

                        {/* Actions */}
                        <View className="flex-row items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                disabled={loading}
                                activeOpacity={0.7}
                            >
                                <Text className="text-sm font-semibold text-gray-500">Hủy bỏ</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleCreate}
                                disabled={loading}
                                className={`flex-row items-center gap-2 h-[48px] px-7 rounded-xl ${
                                    loading ? 'bg-gray-400' : 'bg-gray-900'
                                }`}
                                activeOpacity={0.85}
                                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 }}
                            >
                                {loading ? (
                                    <>
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                        <Text className="text-sm font-bold text-white">Đang xử lý...</Text>
                                    </>
                                ) : (
                                    <Text className="text-sm font-bold text-white">Tạo bộ thẻ</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
        </AuthProvider>
    );
}
