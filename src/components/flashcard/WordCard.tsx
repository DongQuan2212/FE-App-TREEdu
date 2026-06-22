import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashcardWord } from '../../types/flashcardDetail.types';
import { WORD_FORM_LABELS } from '../../constants/flashcardDetail.constants';

interface Props {
    word: FlashcardWord;
    onEdit:   (word: FlashcardWord) => void;
    onDelete: (wordId: string) => void;
}

export default function WordCard({ word, onEdit, onDelete }: Props) {
    const handleDelete = () => {
        Alert.alert(
            'Xóa từ vựng',
            `Bạn chắc chắn muốn xóa từ "${word.newWord}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => onDelete(word.id) },
            ]
        );
    };

    const handlePlayAudio = () => {
        // TODO: thay bằng expo-av
        console.log('play:', word.audioURL);
    };

    return (
        <View
            className="bg-white border border-gray-200 rounded-2xl p-5 mb-3"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
        >
            <View className="flex-row items-start gap-4">
                {/* Left: word info */}
                <View className="flex-1">
                    {/* Word + badge + phoneme + audio */}
                    <View className="flex-row flex-wrap items-center gap-2 mb-3">
                        <Text className="text-[22px] font-extrabold text-gray-900">
                            {word.newWord}
                        </Text>
                        <View className="bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                            <Text className="text-[11px] font-bold text-purple-700">
                                {WORD_FORM_LABELS[word.wordForm] ?? word.wordForm}
                            </Text>
                        </View>
                        {word.phoneme ? (
                            <Text className="text-base text-gray-400 italic">[{word.phoneme}]</Text>
                        ) : null}
                        {word.audioURL ? (
                            <TouchableOpacity
                                onPress={handlePlayAudio}
                                className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <Ionicons name="volume-medium-outline" size={15} color="#6B7280" />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    {/* Meaning */}
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Định nghĩa:
                    </Text>
                    <Text className="text-sm text-gray-800 mb-3">{word.meaning}</Text>


                    {/* Actions */}
                    <View className="flex-row gap-2 pt-3 border-t border-gray-100">
                        <TouchableOpacity
                            onPress={() => onEdit(word)}
                            className="flex-row items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg"
                            activeOpacity={0.75}
                        >
                            <Ionicons name="pencil-outline" size={14} color="#374151" />
                            <Text className="text-xs font-semibold text-gray-700">Sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="flex-row items-center gap-1.5 px-3 py-1.5 bg-white border border-red-300 rounded-lg"
                            activeOpacity={0.75}
                        >
                            <Ionicons name="trash-outline" size={14} color="#DC2626" />
                            <Text className="text-xs font-semibold text-red-600">Xóa</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
}
