import React, { useState } from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [showPassword, setShowPass] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-[#F0FAEA]">
            <StatusBar barStyle="dark-content" backgroundColor="#F0FAEA" />

            <View className="flex-1 justify-center px-5 py-6">
                <View
                    className="bg-white rounded-3xl px-6 pt-8 pb-6"
                    style={{
                        shadowColor: '#3C8240',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.10,
                        shadowRadius: 20,
                        elevation: 6,
                    }}
                >
                    {/* ── Header ── */}
                    <View className="items-center mb-7">
                        <Text className="text-[22px] font-bold text-gray-900 mb-1.5 text-center">
                            Chào mừng bạn trở lại!
                        </Text>
                        <Text className="text-[13px] text-[#7A907A] text-center leading-5">
                            Đăng nhập để tiếp tục hành trình học tập
                        </Text>
                    </View>

                    {/* ── Email ── */}
                    <Text className="text-[13px] font-semibold text-gray-700 mb-2">Email</Text>
                    <TextInput
                        className="h-[50px] border-[1.5px] border-gray-200 rounded-xl px-4 mb-4 text-sm text-gray-900 bg-gray-50"
                        placeholder="Nhập email của bạn"
                        placeholderTextColor="#B0C4A8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* ── Mật khẩu ── */}
                    <Text className="text-[13px] font-semibold text-gray-700 mb-2">Mật khẩu</Text>
                    <View className="flex-row items-center h-[50px] border-[1.5px] border-gray-200 rounded-xl px-4 mb-3 bg-gray-50">
                        <TextInput
                            className="flex-1 text-sm text-gray-900"
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#B0C4A8"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPassword)} className="p-1">
                            <Ionicons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#9CB890"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* ── Quên mật khẩu ── */}
                    <TouchableOpacity className="self-end mb-5">
                        <Text className="text-[13px] font-semibold text-[#4CAF50]">Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* ── Nút Đăng Nhập ── */}
                    <TouchableOpacity
                        className="h-[50px] bg-[#7CB342] rounded-[14px] items-center justify-center mb-5"
                        style={{
                            shadowColor: '#7CB342',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.30,
                            shadowRadius: 10,
                            elevation: 4,
                        }}
                        activeOpacity={0.85}
                        onPress={() => router.replace('/tabs/home' as any)}
                    >
                        <Text className="text-base font-bold text-white tracking-wide">Đăng Nhập</Text>
                    </TouchableOpacity>

                    {/* ── Divider ── */}
                    <View className="flex-row items-center gap-3 mb-5">
                        <View className="flex-1 h-px bg-gray-100" />
                        <Text className="text-[13px] text-gray-400">Hoặc</Text>
                        <View className="flex-1 h-px bg-gray-100" />
                    </View>

                    {/* ── Google ── */}
                    <TouchableOpacity
                        className="flex-row h-[50px] border-[1.5px] border-gray-200 rounded-[14px] items-center justify-center gap-2.5 bg-white"
                        activeOpacity={0.80}
                    >
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                        <Text className="text-sm font-semibold text-gray-700">
                            Đăng nhập bằng Google
                        </Text>
                    </TouchableOpacity>

                    {/* ── Footer ── */}
                    <View className="flex-row justify-center mt-6">
                        <Text className="text-[13px] text-gray-500">Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text className="text-[13px] font-bold text-[#4CAF50]">Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
