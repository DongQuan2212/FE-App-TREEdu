import React from 'react';
import { View, Text, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { MOCK_USER, MENU_SECTIONS } from '@/src/constants/profile.constants';
import ProfileCard  from '../../src/components/user/ProfileCard';
import MenuSection  from '../../src/components/ui/MenuSection';
import LogoutButton from '../../src/components/ui/LogoutButton';

export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc muốn đăng xuất không?',
            [
                { text: 'Huỷ', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: () => router.replace('/') },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F6F4]">
            <StatusBar barStyle="dark-content" backgroundColor="#F4F6F4" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Page title ── */}
                <Text className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-5">
                    Cá nhân
                </Text>

                {/* ── Profile card ── */}
                <ProfileCard
                    user={MOCK_USER}
                    onEdit={() => router.push('/profile/edit' as any)}
                    onChangePassword={() => router.push('/profile/change-password' as any)}
                />

                {/* ── Menu sections ── */}
                {MENU_SECTIONS.map(section => (
                    <MenuSection
                        key={section.id}
                        section={section}
                        onPress={(route) => router.push(route as any)}
                    />
                ))}

                {/* ── Logout ── */}
                <LogoutButton onPress={handleLogout} />

                {/* ── Version ── */}
                <Text className="text-center text-[11px] text-gray-300 mt-2 mb-1">
                    TREEdu v1.0.0
                </Text>

                <View className="h-5" />
            </ScrollView>
        </SafeAreaView>
    );
}
