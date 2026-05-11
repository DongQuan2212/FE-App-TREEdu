import React, { useRef } from 'react';
import {
    SafeAreaView, ScrollView, StatusBar, StyleSheet,
    View, Text, TextInput, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import {useRouter, useLocalSearchParams, Stack} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useResetPassword } from '../src/hooks/useResetPassword';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    // Thêm useRef cho TextInput ẩn
    const inputRef = useRef<TextInput>(null);

    const {
        otp, setOtp,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        showConfirm, setShowConfirm,
        loading, resendLoading,
        errors, clearError,
        seconds, mm, ss,
        handleResend, handleReset,
    } = useResetPassword(email ?? '');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0FAEA" />
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#3B6D11" />
                </TouchableOpacity>

                <View style={styles.card}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="key-outline" size={32} color="#7CB342" />
                    </View>

                    <Text style={styles.title}>Đặt lại mật khẩu</Text>

                    {/* Email badge */}
                    <View style={styles.emailBadge}>
                        <Ionicons name="mail-outline" size={13} color="#3B6D11" />
                        <Text style={styles.emailText}>{email}</Text>
                    </View>

                    {/* ── OTP (Giao diện 6 ô vuông) ── */}
                    <Text style={styles.sectionLabel}>Mã OTP</Text>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => inputRef.current?.focus()}
                        style={styles.otpContainer}
                    >
                        {[0, 1, 2, 3, 4, 5].map((index) => {
                            const digit = otp[index] || '';
                            const isCurrent = index === otp.length; // Highlight ô đang chuẩn bị nhập
                            const hasError = !!errors.otp; // Có lỗi hay không

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.otpBox,
                                        isCurrent && styles.otpBoxActive,
                                        hasError && styles.otpBoxError
                                    ]}
                                >
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
                        onChangeText={(t) => {
                            setOtp(t.replace(/[^0-9]/g, '').slice(0, 6));
                            clearError('otp');
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                    />

                    {errors.otp
                        ? <Text style={styles.errorText}>{errors.otp}</Text>
                        : null
                    }

                    {/* Timer + Resend */}
                    <View style={styles.timerRow}>
                        {seconds > 0 ? (
                            <Text style={styles.timer}>
                                Mã hết hạn sau <Text style={styles.timerAccent}>{mm}:{ss}</Text>
                            </Text>
                        ) : (
                            <Text style={styles.timerExpired}>Mã OTP đã hết hạn</Text>
                        )}
                        <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                            {resendLoading
                                ? <ActivityIndicator size="small" color="#7CB342" />
                                : <Text style={styles.resendLink}>Gửi lại</Text>
                            }
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* ── Mật khẩu mới ── */}
                    <Text style={styles.sectionLabel}>
                        Mật khẩu mới <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={[styles.passwordWrap, errors.newPassword ? styles.inputError : null]}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Ít nhất 6 ký tự"
                            placeholderTextColor="#B0C4A8"
                            secureTextEntry={!showPassword}
                            value={newPassword}
                            onChangeText={(t) => { setNewPassword(t); clearError('newPassword'); }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20} color="#9CB890"
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.newPassword
                        ? <Text style={styles.errorText}>{errors.newPassword}</Text>
                        : null
                    }

                    {/* ── Xác nhận mật khẩu ── */}
                    <Text style={styles.sectionLabel}>
                        Xác nhận mật khẩu <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <View style={[styles.passwordWrap, errors.confirmPassword ? styles.inputError : null]}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Nhập lại mật khẩu"
                            placeholderTextColor="#B0C4A8"
                            secureTextEntry={!showConfirm}
                            value={confirmPassword}
                            onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword'); }}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <Ionicons
                                name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                                size={20} color="#9CB890"
                            />
                        </TouchableOpacity>
                    </View>
                    {errors.confirmPassword
                        ? <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        : null
                    }

                    {/* Submit */}
                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleReset}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" size="small" />
                            : <Text style={styles.btnText}>Xác nhận đặt lại</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0FAEA' },
    scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 24 },
    backBtn: { position: 'absolute', top: 16, left: 20, zIndex: 10, padding: 4 },
    card: {
        backgroundColor: '#fff', borderRadius: 24,
        paddingHorizontal: 24, paddingTop: 32, paddingBottom: 28,
        shadowColor: '#3C8240', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10, shadowRadius: 20, elevation: 6,
    },
    iconWrap: {
        width: 72, height: 72, borderRadius: 36, backgroundColor: '#EAF3DE',
        justifyContent: 'center', alignItems: 'center', marginBottom: 16, alignSelf: 'center',
    },
    title: { fontSize: 22, fontWeight: '700', color: '#111', textAlign: 'center', marginBottom: 12 },
    emailBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#EAF3DE', borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 6,
        alignSelf: 'center', marginBottom: 24,
    },
    emailText: { fontSize: 13, fontWeight: '600', color: '#3B6D11' },
    sectionLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
    asterisk: { color: '#EF4444' },

    /* --- CSS MỚI CHO OTP --- */
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 4,
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
        borderColor: '#7CB342',
        backgroundColor: '#F0FAEA',
    },
    otpBoxError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
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
        opacity: 0,
    },
    /* ----------------------- */

    inputError: { borderColor: '#EF4444' },
    errorText: { fontSize: 12, color: '#EF4444', marginBottom: 10, marginTop: 2 },
    timerRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20, marginTop: 8,
    },
    timer: { fontSize: 12, color: '#7A907A' },
    timerAccent: { color: '#7CB342', fontWeight: '700' },
    timerExpired: { fontSize: 12, color: '#EF4444', fontWeight: '600' },
    resendLink: { fontSize: 13, color: '#4CAF50', fontWeight: '700' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 20 },
    passwordWrap: {
        flexDirection: 'row', alignItems: 'center', height: 50,
        borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
        backgroundColor: '#FAFAFA', paddingHorizontal: 16, marginBottom: 4,
    },
    passwordInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
    btn: {
        width: '100%', height: 50, backgroundColor: '#7CB342', borderRadius: 14,
        justifyContent: 'center', alignItems: 'center', marginTop: 8,
        shadowColor: '#7CB342', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30, shadowRadius: 10, elevation: 4,
    },
    btnDisabled: { backgroundColor: '#A5C880', shadowOpacity: 0.10 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
