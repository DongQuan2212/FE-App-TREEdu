// app/tabs/profile.tsx
import React from 'react';
import { View, Text, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';

import { MENU_SECTIONS }  from '@/src/constants/profile.constants';
import ProfileCard        from '../../src/components/user/ProfileCard';
import MenuSection        from '../../src/components/ui/MenuSection';
import LogoutButton       from '../../src/components/ui/LogoutButton';
import { useAuth }        from '@/src/context/AuthContext';
import { mapCurrentUserToProfile } from '@/src/utils/profileAdapter';

export default function ProfileScreen() {
    const router           = useRouter();
    const { user, logout } = useAuth();

    // Map CurrentUser (BE) → User (profile.types) mà ProfileCard expect
    // Trả về null nếu user chưa load → ProfileCard tự xử lý skeleton
    const profileUser = user ? mapCurrentUserToProfile(user) : null;

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc muốn đăng xuất không?',
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text:    'Đăng xuất',
                    style:   'destructive',
                    onPress: logout,   // ← xoá token + reset state, index.tsx tự redirect
                },
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
            

                {/* ── Profile card ── */}
                <ProfileCard
                    user={profileUser}                                           // ← dữ liệu thật, có thể null
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
