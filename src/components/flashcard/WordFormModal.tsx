import React from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Modal, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordFormState } from '../../types/flashcardDetail.types';
import { WORD_FORM_OPTIONS } from '../../constants/flashcardDetail.constants';

interface Props {
    visible: boolean;
    title: string;
    form: WordFormState;
    actionText: string;
    onChange: (field: keyof WordFormState, value: string) => void;
    onSubmit: () => void;
    onClose: () => void;
}

export default function WordFormModal({
                                          visible, title, form, actionText,
                                          onChange, onSubmit, onClose,
                                      }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Backdrop */}
                <TouchableOpacity
                    className="flex-1 bg-black/50"
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Sheet */}
                <View
                    className="bg-white rounded-t-3xl"
                    style={{ maxHeight: '90%' }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                        <Text className="text-[17px] font-bold text-gray-900">{title}</Text>
                        <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                            <Ionicons name="close" size={18} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={{ padding: 20, gap: 16 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Từ vựng */}
                        <View>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">
                                Từ vựng <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className="h-[46px] border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50"
                                placeholder="Nhập từ vựng..."
                                placeholderTextColor="#9CA3AF"
                                value={form.newWord}
                                onChangeText={v => onChange('newWord', v)}
                            />
                        </View>

                        {/* Nghĩa */}
                        <View>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">
                                Nghĩa <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className="h-[46px] border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50"
                                placeholder="Nhập nghĩa..."
                                placeholderTextColor="#9CA3AF"
                                value={form.meaning}
                                onChangeText={v => onChange('meaning', v)}
                            />
                        </View>

                        {/* Ví dụ */}
                        <View>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">Ví dụ</Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50"
                                placeholder="Nhập câu ví dụ..."
                                placeholderTextColor="#9CA3AF"
                                value={form.example}
                                onChangeText={v => onChange('example', v)}
                                multiline
                                numberOfLines={2}
                                style={{ textAlignVertical: 'top', minHeight: 60 }}
                            />
                        </View>

                        {/* Loại từ + Phiên âm */}
                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-xs font-semibold text-gray-700 mb-1.5">Loại từ</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row gap-2">
                                        {WORD_FORM_OPTIONS.map(opt => (
                                            <TouchableOpacity
                                                key={opt.value}
                                                onPress={() => onChange('wordForm', opt.value)}
                                                className={`px-3 py-2 rounded-lg border ${
                                                    form.wordForm === opt.value
                                                        ? 'bg-gray-900 border-gray-900'
                                                        : 'bg-white border-gray-200'
                                                }`}
                                            >
                                                <Text className={`text-xs font-semibold ${
                                                    form.wordForm === opt.value ? 'text-white' : 'text-gray-600'
                                                }`}>
                                                    {opt.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        {/* Phiên âm */}
                        <View>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">Phiên âm</Text>
                            <TextInput
                                className="h-[46px] border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50"
                                placeholder="/həˈloʊ/"
                                placeholderTextColor="#9CA3AF"
                                value={form.phoneme}
                                onChangeText={v => onChange('phoneme', v)}
                            />
                        </View>

                        {/* URL Hình ảnh */}
                        <View>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">URL Hình ảnh</Text>
                            <View className="flex-row items-center h-[46px] border border-gray-200 rounded-xl bg-gray-50">
                                <View className="px-3">
                                    <Ionicons name="link-outline" size={16} color="#9CA3AF" />
                                </View>
                                <TextInput
                                    className="flex-1 text-sm text-gray-900 pr-3"
                                    placeholder="https://..."
                                    placeholderTextColor="#9CA3AF"
                                    value={form.imageURL}
                                    onChangeText={v => onChange('imageURL', v)}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* URL Âm thanh */}
                        <View>
                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">URL Âm thanh</Text>
                            <View className="flex-row items-center h-[46px] border border-gray-200 rounded-xl bg-gray-50">
                                <View className="px-3">
                                    <Ionicons name="volume-medium-outline" size={16} color="#9CA3AF" />
                                </View>
                                <TextInput
                                    className="flex-1 text-sm text-gray-900 pr-3"
                                    placeholder="https://..."
                                    placeholderTextColor="#9CA3AF"
                                    value={form.audioURL}
                                    onChangeText={v => onChange('audioURL', v)}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Buttons */}
                        <View className="flex-row gap-3 pt-2">
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 h-[48px] border border-gray-200 rounded-xl items-center justify-center"
                                activeOpacity={0.75}
                            >
                                <Text className="text-sm font-semibold text-gray-600">Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onSubmit}
                                className="flex-1 h-[48px] bg-[#22C55E] rounded-xl items-center justify-center"
                                activeOpacity={0.85}
                            >
                                <Text className="text-sm font-bold text-white">{actionText}</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="h-4" />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
