import React, { useEffect, useState, useRef } from 'react';
import {
    SafeAreaView, ScrollView, StatusBar,
    StyleSheet, View, Text, TextInput,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import {useRouter, useLocalSearchParams, Stack} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVerifyOtp } from '../src/hooks/useVerifyOtp';

export default function VerifyOtpScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const { otp, setOtp, loading, resendLoading, handleVerify, handleResend } = useVerifyOtp(email ?? '');

    // Tạo ref để điều khiển TextInput ẩn
    const inputRef = useRef<TextInput>(null);

    // Đếm ngược 5 phút
    const [seconds, setSeconds] = useState(300);
    useEffect(() => {
        if (seconds <= 0) return;
        const t = setTimeout(() => setSeconds(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [seconds]);

    const resetTimer = () => {
        setSeconds(300);
        handleResend();
    };

    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" backgroundColor="#F0FAEA" />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    {/* Icon */}
                    <View style={styles.iconWrap}>
                        <Ionicons name="mail-outline" size={32} color="#7CB342" />
                    </View>

                    {/* Header */}
                    <Text style={styles.title}>Xác thực email</Text>
                    <Text style={styles.subtitle}>
                        Mã OTP gồm 6 chữ số đã được gửi đến
                    </Text>
                    <View style={styles.emailBadge}>
                        <Text style={styles.emailText}>{email}</Text>
                    </View>

                    {/* OTP Input - 6 Ô vuông */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => inputRef.current?.focus()}
                        style={styles.otpContainer}
                    >
                        {[0, 1, 2, 3, 4, 5].map((index) => {
                            const digit = otp[index] || '';
                            const isCurrent = index === otp.length; // Highlight ô đang chuẩn bị nhập
                            return (
                                <View key={index} style={[styles.otpBox, isCurrent && styles.otpBoxActive]}>
                                    <Text style={styles.otpText}>{digit}</Text>
                                </View>
                            );
                        })}
                    </TouchableOpacity>

                    {/* TextInput ẩn */}
                    <TextInput
                        ref={inputRef}
                        style={styles.hiddenInput}
                        value={otp}
                        onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, '').slice(0, 6))}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus={true} // Tự động focus khi mở màn hình
                    />

                    <Text style={styles.hint}>
                        Kiểm tra hộp thư đến hoặc thư mục spam
                    </Text>

                    {/* Timer */}
                    {seconds > 0 ? (
                        <Text style={styles.timer}>
                            Mã hết hạn sau{' '}
                            <Text style={styles.timerAccent}>{mm}:{ss}</Text>
                        </Text>
                    ) : (
                        <Text style={styles.timerExpired}>Mã OTP đã hết hạn</Text>
                    )}

                    {/* Nút xác nhận */}
                    <TouchableOpacity
                        style={[styles.btnVerify, (loading || otp.length < 6) && styles.btnDisabled]}
                        onPress={handleVerify}
                        disabled={loading || otp.length < 6}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" size="small" />
                            : <Text style={styles.btnVerifyText}>Xác nhận</Text>
                        }
                    </TouchableOpacity>

                    {/* Nút gửi lại */}
                    <TouchableOpacity
                        style={styles.btnResend}
                        onPress={resetTimer}
                        disabled={resendLoading}
                        activeOpacity={0.85}
                    >
                        {resendLoading
                            ? <ActivityIndicator color="#7A907A" size="small" />
                            : (
                                <>
                                    <Ionicons name="refresh-outline" size={16} color="#7A907A" />
                                    <Text style={styles.btnResendText}>Gửi lại mã OTP</Text>
                                </>
                            )
                        }
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Nhập sai email? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.footerLink}>Quay lại đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0FAEA' },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 24 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24,
        shadowColor: '#3C8240', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10, shadowRadius: 20, elevation: 6,
        alignItems: 'center',
    },
    iconWrap: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#EAF3DE',
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    },
    title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 13, color: '#7A907A', textAlign: 'center', marginBottom: 8 }, // Tôi chỉnh lại font size này một chút cho dễ đọc (gốc là 8)
    emailBadge: {
        backgroundColor: '#EAF3DE', borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 4, marginBottom: 24,
    },
    emailText: { fontSize: 13, fontWeight: '600', color: '#3B6D11' },

    /* --- CSS MỚI CHO OTP --- */
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    otpBox: {
        width: 45,
        height: 55,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpBoxActive: {
        borderColor: '#7CB342', // Đổi màu viền xanh khi ô đó đang được trỏ tới
        backgroundColor: '#F0FAEA',
    },
    otpText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0, // Làm ẩm input thật đi
    },
    /* ----------------------- */

    hint: { fontSize: 12, color: '#A0B090', marginBottom: 12, textAlign: 'center' },
    timer: { fontSize: 13, color: '#7A907A', marginBottom: 20 },
    timerAccent: { color: '#7CB342', fontWeight: '700' },
    timerExpired: { fontSize: 13, color: '#EF4444', marginBottom: 20, fontWeight: '600' },
    btnVerify: {
        width: '100%', height: 50,
        backgroundColor: '#7CB342', borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 12, shadowColor: '#7CB342',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 10, elevation: 4,
    },
    btnDisabled: { backgroundColor: '#A5C880', shadowOpacity: 0.10 },
    btnVerifyText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    btnResend: {
        width: '100%', height: 46,
        borderWidth: 1.5, borderColor: '#E0E0E0',
        borderRadius: 14, flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 20,
    },
    btnResendText: { color: '#7A907A', fontSize: 14, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', width: '100%' },
    footerText: { color: '#888', fontSize: 13 },
    footerLink: { color: '#4CAF50', fontSize: 13, fontWeight: '700' },
});
