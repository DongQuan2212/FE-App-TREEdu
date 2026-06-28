import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StatusBar, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import { API_ENDPOINTS } from '@/src/constants/api';

export default function ResendVerifyEmailScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSendOtp = async () => {
        if (!email.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập email của bạn.');
            return;
        }

        setLoading(true);
        try {
            // Gọi API bằng API_ENDPOINTS.resendOtp đã cấu hình
            await axios.post(API_ENDPOINTS.resendOtp, null, {
                params: {
                    email: email.trim(),
                    type: 'SIGNUP' // Xác định luồng đăng ký/kích hoạt
                }
            });

            Alert.alert('Thành công', 'Mã OTP kích hoạt đã được gửi tới email của bạn!');

            // Chuyển hướng sang trang verify.tsx theo cấu trúc thư mục của bạn
            router.push({
                pathname: '/verify',
                params: {
                    email: email.trim(),
                    type: 'SIGNUP'
                }
            });

        } catch (err: any) {
            console.error('Gửi OTP thất bại:', err);
            let errorMessage = 'Không thể gửi mã OTP. Vui lòng kiểm tra lại email!';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            Alert.alert('Lỗi', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F0FAEA]">
            <StatusBar barStyle="dark-content" backgroundColor="#F0FAEA" />

            {/* ── Nút Quay Lại ── */}
            <View className="px-5 pt-4 pb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-white/60 rounded-full items-center justify-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="#4B5563" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="px-6 pb-20">
                        <View
                            className="bg-white rounded-3xl p-6 pt-8 pb-8"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.05,
                                shadowRadius: 15,
                                elevation: 8,
                            }}
                        >
                            {/* ── Header Icon & Title ── */}
                            <View className="items-center mb-8">
                                <View className="w-16 h-16 bg-[#F0FAEA] rounded-full items-center justify-center mb-4">
                                    <Ionicons name="mail-unread-outline" size={32} color="#7CB342" />
                                </View>
                                <Text className="text-2xl font-bold text-gray-800 mb-2">
                                    Kích Hoạt Tài Khoản
                                </Text>
                                <Text className="text-[14px] text-gray-500 text-center px-4 leading-5">
                                    Nhập email bạn đã đăng ký để nhận mã OTP xác thực
                                </Text>
                            </View>

                            {/* ── Form Input ── */}
                            <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                Email của bạn
                            </Text>
                            <View
                                className={`flex-row items-center h-[54px] rounded-2xl px-4 mb-6 ${
                                    isFocused
                                        ? 'border-2 border-[#7CB342] bg-white'
                                        : 'border border-gray-200 bg-gray-50'
                                }`}
                            >
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={isFocused ? '#7CB342' : '#9CA3AF'}
                                />
                                <TextInput
                                    className="flex-1 text-[15px] text-gray-900 ml-3"
                                    placeholder="nhap-email@example.com"
                                    placeholderTextColor="#C4CEC4"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    editable={!loading}
                                />
                            </View>

                            {/* ── Nút Gửi ── */}
                            <TouchableOpacity
                                className="h-[54px] rounded-2xl items-center justify-center"
                                style={{
                                    backgroundColor: loading || !email.trim() ? '#A5C880' : '#7CB342',
                                    shadowColor: '#7CB342',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: loading || !email.trim() ? 0.1 : 0.3,
                                    shadowRadius: 8,
                                    elevation: 4,
                                }}
                                activeOpacity={0.85}
                                onPress={handleSendOtp}
                                disabled={loading || !email.trim()}
                            >
                                {loading ? (
                                    <View className="flex-row items-center gap-2">
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                        <Text className="text-[16px] font-bold text-white">
                                            Đang gửi mã...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text className="text-[16px] font-bold text-white tracking-wide">
                                        Gửi Mã Xác Thực
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
