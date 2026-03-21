import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onPress: () => void;
}

export default function LogoutButton({ onPress }: Props) {
    return (
        <View className="mb-4">
            <View className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <TouchableOpacity
                    className="flex-row items-center px-4 py-3.5 gap-3.5"
                    activeOpacity={0.75}
                    onPress={onPress}
                >
                    <View className="w-[38px] h-[38px] rounded-[10px] bg-red-50 items-center justify-center shrink-0">
                        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-red-500 mb-0.5">Đăng xuất</Text>
                        <Text className="text-[11px] text-gray-400">Thoát khỏi tài khoản</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#FCA5A5" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
