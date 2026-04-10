import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StatusBar, Image, Animated, Dimensions,
    KeyboardAvoidingView, Platform, ScrollView,
    ActivityIndicator,                          // ← thêm
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '@/src/hooks/useLogin'; // ← thêm

const { height } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();

    // ── Thay các useState thủ công bằng hook ─────────────
    const {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPass,
        loading, errors,
        clearError,
        handleLogin,
    } = useLogin();

    const [emailFocused, setEmailFocused] = useState(false);
    const [passFocused,  setPassFocused]  = useState(false);

    const mascotBounce = useRef(new Animated.Value(0)).current;
    const mascotScale  = useRef(new Animated.Value(0.8)).current;
    const mascotRotate = useRef(new Animated.Value(0)).current;

    // ── Hàm animation — gọi lại bất cứ lúc nào ──────────
    const playMascotAnim = () => {
        mascotBounce.setValue(0);
        mascotRotate.setValue(0);

        Animated.parallel([
            Animated.sequence([
                Animated.timing(mascotBounce, { toValue: -18, duration: 200, useNativeDriver: true }),
                Animated.spring(mascotBounce, { toValue: 0, friction: 4, tension: 100, useNativeDriver: true }),
            ]),
            Animated.sequence([
                Animated.timing(mascotRotate, { toValue: 1,  duration: 80, useNativeDriver: true }),
                Animated.timing(mascotRotate, { toValue: -1, duration: 80, useNativeDriver: true }),
                Animated.timing(mascotRotate, { toValue: 1,  duration: 80, useNativeDriver: true }),
                Animated.timing(mascotRotate, { toValue: 0,  duration: 80, useNativeDriver: true }),
            ]),
        ]).start();
    };

    // Play lần đầu khi mount
    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(mascotScale, {
                toValue: 1,
                friction: 5,
                tension: 60,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(mascotBounce, { toValue: -12, duration: 300, useNativeDriver: true }),
                Animated.spring(mascotBounce, { toValue: 0, friction: 4, tension: 80, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const rotateInterpolate = mascotRotate.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-8deg', '0deg', '8deg'],
    });

    return (
        <SafeAreaView className="flex-1 bg-[#F0FAEA]">
            <StatusBar barStyle="dark-content" backgroundColor="#F0FAEA" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Top section: mascot ── */}
                    <View
                        className="items-center justify-center pb-1"
                        style={{ height: height * 0.32 }}
                    >
                        <TouchableOpacity onPress={playMascotAnim} activeOpacity={1}>
                            <Animated.View
                                style={{
                                    transform: [
                                        { translateY: mascotBounce },
                                        { scale: mascotScale },
                                        { rotate: rotateInterpolate },
                                    ],
                                }}
                            >
                                <Image
                                    source={require('../../../assets/images/betre-logo.png')}
                                    style={{ width: 420, height: 420 }}
                                    resizeMode="contain"
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                    {/* ── Bottom card: form ── */}
                    <View
                        className="flex-1 bg-white px-6 pt-8 pb-6"
                        style={{
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -4 },
                            shadowOpacity: 0.06,
                            shadowRadius: 20,
                            elevation: 10,
                        }}
                    >
                        {/* Pull indicator */}
                        <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-6" />

                        {/* ── Email ── */}
                        <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Email
                        </Text>
                        <View
                            className={`flex-row items-center h-[52px] rounded-2xl px-4 mb-1 ${
                                emailFocused
                                    ? 'border-2 border-[#7CB342] bg-white'
                                    : errors.email
                                        ? 'border-2 border-red-400 bg-white'
                                        : 'border border-gray-200 bg-gray-50'
                            }`}
                        >
                            <Ionicons
                                name="mail-outline"
                                size={18}
                                color={emailFocused ? '#7CB342' : errors.email ? '#F87171' : '#9CA3AF'}
                            />
                            <TextInput
                                className="flex-1 text-sm text-gray-900 ml-3"
                                placeholder="email@example.com"
                                placeholderTextColor="#C4CEC4"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(t) => { setEmail(t); clearError('email'); }}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                            />
                        </View>
                        {errors.email
                            ? <Text className="text-red-400 text-[12px] mb-3 ml-1">{errors.email}</Text>
                            : <View className="mb-4" />
                        }

                        {/* ── Mật khẩu ── */}
                        <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Mật khẩu
                        </Text>
                        <View
                            className={`flex-row items-center h-[52px] rounded-2xl px-4 mb-1 ${
                                passFocused
                                    ? 'border-2 border-[#7CB342] bg-white'
                                    : errors.password
                                        ? 'border-2 border-red-400 bg-white'
                                        : 'border border-gray-200 bg-gray-50'
                            }`}
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={18}
                                color={passFocused ? '#7CB342' : errors.password ? '#F87171' : '#9CA3AF'}
                            />
                            <TextInput
                                className="flex-1 text-sm text-gray-900 ml-3"
                                placeholder="••••••••"
                                placeholderTextColor="#C4CEC4"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={(t) => { setPassword(t); clearError('password'); }}
                                onFocus={() => setPassFocused(true)}
                                onBlur={() => setPassFocused(false)}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPass(!showPassword)}
                                className="p-1"
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={18}
                                    color="#9CB890"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password
                            ? <Text className="text-red-400 text-[12px] mb-2 ml-1">{errors.password}</Text>
                            : <View className="mb-3" />
                        }

                        {/* ── Quên mật khẩu ── */}
                        <TouchableOpacity className="self-end mb-6">
                            <Text className="text-[13px] font-semibold text-[#7CB342]">
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>

                        {/* ── Nút Đăng Nhập ── */}
                        <TouchableOpacity
                            className="h-[54px] rounded-2xl items-center justify-center mb-5"
                            style={{
                                backgroundColor: loading ? '#A5C880' : '#7CB342',
                                shadowColor: '#7CB342',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: loading ? 0.10 : 0.35,
                                shadowRadius: 12,
                                elevation: 6,
                            }}
                            activeOpacity={0.85}
                            onPress={handleLogin}   // ← gọi hook thay vì router thẳng
                            disabled={loading}      // ← chặn double click
                        >
                            {loading
                                ? <ActivityIndicator color="#FFFFFF" size="small" />
                                : <Text className="text-[16px] font-bold text-white tracking-wide">Đăng nhập</Text>
                            }
                        </TouchableOpacity>

                        {/* ── Divider ── */}
                        <View className="flex-row items-center gap-3 mb-5">
                            <View className="flex-1 h-px bg-gray-100" />
                            <Text className="text-[12px] text-gray-400 font-medium">hoặc</Text>
                            <View className="flex-1 h-px bg-gray-100" />
                        </View>

                        {/* ── Google ── */}
                        <TouchableOpacity
                            className="flex-row h-[52px] border border-gray-200 rounded-2xl items-center justify-center gap-3 bg-white mb-6"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                            activeOpacity={0.80}
                        >
                            <Ionicons name="logo-google" size={20} color="#DB4437" />
                            <Text className="text-[14px] font-semibold text-gray-700">
                                Đăng nhập bằng Google
                            </Text>
                        </TouchableOpacity>

                        {/* ── Footer ── */}
                        <View className="flex-row justify-center">
                            <Text className="text-[13px] text-gray-400">
                                Chưa có tài khoản?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text className="text-[13px] font-bold text-[#7CB342]">
                                    Đăng ký ngay
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
