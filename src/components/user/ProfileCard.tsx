import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../types/profile.types';

interface Props {
    user: User;
    onEdit: () => void;
    onChangePassword: () => void;
}

interface InfoRowProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value: string;
    bold?: boolean;
    showDivider?: boolean;
}

function InfoRow({ icon, label, value, bold = false, showDivider = false }: InfoRowProps) {
    return (
        <>
            <View className="flex-row items-center gap-3.5 py-3.5">
                <View className="w-8 h-8 rounded-lg bg-gray-50 items-center justify-center shrink-0">
                    <Ionicons name={icon} size={16} color="#6B7280" />
                </View>
                <View className="flex-1">
                    <Text className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</Text>
                    <Text
                        className={`text-sm ${bold ? 'text-gray-900 font-bold' : 'text-gray-500'}`}
                        numberOfLines={1}
                    >
                        {value}
                    </Text>
                </View>
            </View>
            {showDivider && <View className="h-px bg-gray-50 ml-[46px]" />}
        </>
    );
}

export default function ProfileCard({ user, onEdit, onChangePassword }: Props) {
    return (
        <View className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
            {/* ── Avatar + name ── */}
            <View className="flex-row items-center gap-3.5 p-5">
                <View className="w-[60px] h-[60px] rounded-full bg-gray-800 items-center justify-center">
                    <Text className="text-xl font-bold text-white tracking-wide">
                        {user.initials}
                    </Text>
                </View>
                <View className="flex-1">
                    <Text className="text-[18px] font-bold text-gray-900 mb-1.5">
                        {user.name}
                    </Text>
                    <View className="flex-row items-center gap-1 self-start bg-gray-100 px-2.5 py-1 rounded-full">
                        <Ionicons name="shield-checkmark-outline" size={11} color="#4B5563" />
                        <Text className="text-[11px] font-semibold text-gray-600">{user.role}</Text>
                    </View>
                </View>
            </View>

            <View className="h-px bg-gray-100" />

            {/* ── Info rows ── */}
            <View className="px-5 py-1">
                <InfoRow icon="mail-outline"    label="Email"    value={user.email} showDivider />
                <InfoRow icon="person-outline"  label="Họ và tên" value={user.name} bold showDivider />
                <InfoRow icon="shield-outline"  label="Vai trò"  value={user.role} />
            </View>

            <View className="h-px bg-gray-100" />

            {/* ── Action buttons ── */}
            <View className="flex-row gap-2.5 p-5">
                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-1.5 h-[46px] bg-gray-800 rounded-xl"
                    activeOpacity={0.85}
                    onPress={onEdit}
                >
                    <Ionicons name="pencil-outline" size={15} color="#FFFFFF" />
                    <Text className="text-[13px] font-bold text-white">Chỉnh sửa hồ sơ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-1.5 h-[46px] bg-white border-[1.5px] border-gray-200 rounded-xl"
                    activeOpacity={0.85}
                    onPress={onChangePassword}
                >
                    <Ionicons name="lock-closed-outline" size={15} color="#111111" />
                    <Text className="text-[13px] font-bold text-gray-900">Đổi mật khẩu</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
