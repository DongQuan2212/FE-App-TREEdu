import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RegisterFormErrors } from '../../types/auth';

interface Props {
    fullName: string;
    email: string;
    password: string;
    showPassword: boolean;
    loading: boolean;
    errors: RegisterFormErrors;
    onChangeFullName: (text: string) => void;
    onChangeEmail: (text: string) => void;
    onChangePassword: (text: string) => void;
    onTogglePassword: () => void;
    onSubmit: () => void;
    onGoLogin: () => void;
}

export default function RegisterForm({
                                         fullName, email, password,
                                         showPassword, loading, errors,
                                         onChangeFullName, onChangeEmail, onChangePassword,
                                         onTogglePassword, onSubmit, onGoLogin,
                                     }: Props) {
    return (
        <View style={styles.card}>

            {/* Tiêu đề */}
            <View style={styles.header}>
                <Text style={styles.title}>Tạo tài khoản mới</Text>
                <Text style={styles.subtitle}>Tham gia cùng chúng tôi ngay hôm nay!</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>

                {/* Họ và tên */}
                <Text style={styles.label}>
                    Họ và tên <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                    style={[styles.input, errors.fullName ? styles.inputError : null]}
                    placeholder="Nguyễn Văn A"
                    placeholderTextColor="#B0C4A8"
                    value={fullName}
                    onChangeText={onChangeFullName}
                />
                {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

                {/* Email */}
                <Text style={styles.label}>
                    Email <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                    style={[styles.input, errors.email ? styles.inputError : null]}
                    placeholder="you@example.com"
                    placeholderTextColor="#B0C4A8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={onChangeEmail}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                {/* Mật khẩu */}
                <Text style={styles.label}>
                    Mật khẩu <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={[styles.passwordWrapper, errors.password ? styles.inputError : null]}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Ít nhất 6 ký tự"
                        placeholderTextColor="#B0C4A8"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={onChangePassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={onTogglePassword}>
                        <Ionicons
                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color="#9CB890"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                <Text style={styles.passwordHint}>
                    Mật khẩu nên có chữ hoa, chữ số và ký tự đặc biệt
                </Text>

                {/* Nút Đăng Ký */}
                <TouchableOpacity
                    style={[styles.registerButton, loading ? styles.registerButtonDisabled : null]}
                    activeOpacity={0.85}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#FFFFFF" size="small" />
                        : <Text style={styles.registerButtonText}>Đăng Ký Ngay</Text>
                    }
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={onGoLogin}>
                    <Text style={styles.loginText}>Đăng nhập ngay</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: 4,
        fontSize: 14,
        color: '#1A1A1A',
        backgroundColor: '#FAFAFA',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginBottom: 12,
        marginTop: 2,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        marginBottom: 4,
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
    passwordHint: {
        fontSize: 12,
        color: '#A0B090',
        marginBottom: 20,
        marginTop: 4,
        lineHeight: 18,
    },
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
    registerButtonDisabled: {
        backgroundColor: '#A5C880',
        shadowOpacity: 0.10,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
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
