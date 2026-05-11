import React from 'react';
import {
    SafeAreaView, ScrollView, StatusBar, StyleSheet,
    View, Text, TextInput, TouchableOpacity, ActivityIndicator,
} from 'react-native';
// 1. Thêm Stack vào import
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForgotPassword } from '../src/hooks/useForgotPassword';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { email, setEmail, loading, error, setError, handleSend } = useForgotPassword();

    return (
        <SafeAreaView style={styles.container}>
            {/* 2. Thêm dòng này để ẩn header mặc định của Expo Router */}
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#3B6D11" />
                </TouchableOpacity>

                <View style={styles.card}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="lock-open-outline" size={32} color="#7CB342" />
                    </View>

                    <Text style={styles.title}>Quên mật khẩu</Text>
                    <Text style={styles.subtitle}>
                        Nhập email đăng ký của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                    </Text>

                    <Text style={styles.label}>Email <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        placeholder="you@example.com"
                        placeholderTextColor="#B0C4A8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(t) => { setEmail(t); setError(''); }}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleSend}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" size="small" />
                            : <Text style={styles.btnText}>Gửi mã OTP</Text>
                        }
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Nhớ mật khẩu rồi? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.footerLink}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24,
        shadowColor: '#3C8240', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10, shadowRadius: 20, elevation: 6, alignItems: 'center',
    },
    iconWrap: {
        width: 72, height: 72, borderRadius: 36, backgroundColor: '#EAF3DE',
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    },
    title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 13, color: '#7A907A', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
    label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8, alignSelf: 'flex-start' },
    asterisk: { color: '#EF4444' },
    input: {
        width: '100%', height: 50, borderWidth: 1.5, borderColor: '#E0E0E0',
        borderRadius: 12, paddingHorizontal: 16, fontSize: 14,
        color: '#1A1A1A', backgroundColor: '#FAFAFA', marginBottom: 4,
    },
    inputError: { borderColor: '#EF4444' },
    errorText: { fontSize: 12, color: '#EF4444', marginBottom: 12, alignSelf: 'flex-start' },
    btn: {
        width: '100%', height: 50, backgroundColor: '#7CB342', borderRadius: 14,
        justifyContent: 'center', alignItems: 'center', marginTop: 8,
        shadowColor: '#7CB342', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30, shadowRadius: 10, elevation: 4,
    },
    btnDisabled: { backgroundColor: '#A5C880', shadowOpacity: 0.10 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    footer: {
        flexDirection: 'row', justifyContent: 'center', marginTop: 24,
        paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', width: '100%',
    },
    footerText: { color: '#888', fontSize: 13 },
    footerLink: { color: '#4CAF50', fontSize: 13, fontWeight: '700' },
});
