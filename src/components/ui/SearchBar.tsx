import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFocus?: () => void;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Tìm kiếm...', onFocus }: Props) {
    return (
        <View className="flex-row items-center h-[46px] bg-white border border-gray-200 rounded-xl px-3.5 gap-2 mb-3">
            <Ionicons name="search-outline" size={16} color="#9CA3AF" />
            <TextInput
                className="flex-1 text-sm text-gray-900"
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
            )}
        </View>
    );
}
