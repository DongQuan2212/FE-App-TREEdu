import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onPress: () => void;
}

export default function CreateCard({ onPress }: Props) {
    return (
        <TouchableOpacity
            className="w-[48%] min-h-[200px] bg-white border border-dashed border-gray-300 rounded-2xl items-center justify-center p-4 mb-3"
            activeOpacity={0.80}
            onPress={onPress}
        >
            <View className="w-[52px] h-[52px] rounded-full bg-gray-100 items-center justify-center mb-3">
                <Ionicons name="add" size={28} color="#9CA3AF" />
            </View>
            <Text className="text-sm font-bold text-gray-700 text-center mb-1">
                Tạo bộ thẻ mới
            </Text>
            <Text className="text-[11px] text-gray-400 text-center">
                Thêm từ vựng của riêng bạn
            </Text>
        </TouchableOpacity>
    );
}
