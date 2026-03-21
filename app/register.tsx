import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0FAEA" />

            {/* ── Card đăng ký ── */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>

                    {/* Tiêu đề */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Tạo tài khoản mới</Text>
                        <Text style={styles.subtitle}>
                            Tham gia cùng chúng tôi ngay hôm nay!
                        </Text>
                    </View>

                    {/* Form nhập liệu */}
                    <View style={styles.form}>

                        {/* Họ và tên */}
                        <Text style={styles.label}>
                            Họ và tên <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nguyễn Văn A"
                            placeholderTextColor="#B0C4A8"
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        {/* Email */}
                        <Text style={styles.label}>
                            Email <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@example.com"
                            placeholderTextColor="#B0C4A8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {/* Mật khẩu */}
                        <Text style={styles.label}>
                            Mật khẩu <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Ít nhất 6 ký tự"
                                placeholderTextColor="#B0C4A8"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#9CB890"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Gợi ý độ mạnh mật khẩu */}
                        <Text style={styles.passwordHint}>
                            Mật khẩu nên có chữ hoa, chữ số và ký tự đặc biệt
                        </Text>

                        {/* Nút Đăng Ký */}
                        <TouchableOpacity
                            style={styles.registerButton}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.registerButtonText}>Đăng Ký Ngay</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer đăng nhập */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginText}>Đăng nhập ngay</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ── Nền & layout chính ──────────────────────────────────
    container: {
        flex: 1,
        backgroundColor: '#F0FAEA',
    },

    // ── Header (Logo + BẮT ĐẦU) ────────────────────────────
    appHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 110,
        height: 36,
    },
    startButton: {
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
    },
    startButtonText: {
        color: '#2d7a2d',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    headerDivider: {
        height: 1,
        backgroundColor: '#D4E8CC',
    },

    // ── ScrollView ──────────────────────────────────────────
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
    },

    // ── Card trắng ──────────────────────────────────────────
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        shadowColor: '#3C8240',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 20,
        elevation: 6,
    },

    // ── Tiêu đề ─────────────────────────────────────────────
    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111111',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#7A907A',
        textAlign: 'center',
        lineHeight: 20,
    },

    // ── Form ─────────────────────────────────────────────────
    form: {
        width: '100%',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    asterisk: {
        color: '#EF4444',
    },
    input: {
        height: 50,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 14,
        color: '#1A1A1A',
        backgroundColor: '#FAFAFA',
    },

    // ── Ô mật khẩu (có icon mắt) ────────────────────────────
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
    },
    eyeIcon: {
        padding: 4,
    },

    // ── Gợi ý mật khẩu ──────────────────────────────────────
    passwordHint: {
        fontSize: 12,
        color: '#A0B090',
        marginBottom: 20,
        lineHeight: 18,
    },

    // ── Nút Đăng Ký ─────────────────────────────────────────
    registerButton: {
        backgroundColor: '#7CB342',
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        shadowColor: '#7CB342',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 10,
        elevation: 4,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // ── Footer ──────────────────────────────────────────────
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerText: {
        color: '#888888',
        fontSize: 13,
    },
    loginText: {
        color: '#4CAF50',
        fontSize: 13,
        fontWeight: '700',
    },
});
