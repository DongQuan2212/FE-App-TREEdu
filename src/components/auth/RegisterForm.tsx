import React from 'react';
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RegisterFormErrors } from '../../types/auth';

interface Props {
    fullName: string;
    email: string;
    password: string;
    rePassword: string;
    phoneNumber: string;
    birthYear: string;
    address: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    showPassword: boolean;
    showRePassword: boolean;
    loading: boolean;
    errors: RegisterFormErrors;
    avatarFileName?: string | null; // Cập nhật: Dùng để hiển thị tên ảnh
    onChangeFullName: (text: string) => void;
    onChangeEmail: (text: string) => void;
    onChangePassword: (text: string) => void;
    onChangeRePassword: (text: string) => void;
    onChangePhoneNumber: (text: string) => void;
    onChangeBirthYear: (text: string) => void;
    onChangeAddress: (text: string) => void;
    onChangeGender: (gender: 'MALE' | 'FEMALE' | 'OTHER') => void;
    onTogglePassword: () => void;
    onToggleRePassword: () => void;
    onSubmit: () => void;
    onGoLogin: () => void;
    onSelectAvatar: () => void; // Cập nhật: Hàm xử lý khi bấm nút chọn ảnh
}

const GENDER_OPTIONS: { label: string; value: 'MALE' | 'FEMALE' | 'OTHER' }[] = [
    { label: 'Nam', value: 'MALE' },
    { label: 'Nữ', value: 'FEMALE' },
    { label: 'Khác', value: 'OTHER' },
];

export default function RegisterForm({
                                         fullName, email, password, rePassword,
                                         phoneNumber, birthYear, address, gender,
                                         showPassword, showRePassword, loading, errors, avatarFileName,
                                         onChangeFullName, onChangeEmail, onChangePassword, onChangeRePassword,
                                         onChangePhoneNumber, onChangeBirthYear, onChangeAddress, onChangeGender,
                                         onTogglePassword, onToggleRePassword, onSubmit, onGoLogin, onSelectAvatar
                                     }: Props) {
    return (
        <View style={styles.card}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Tạo tài khoản mới</Text>
                <Text style={styles.subtitle}>Tham gia cùng chúng tôi để nâng cấp vốn từ vựng ngay hôm nay!</Text>
            </View>

            {/* ── SECTION 1: Thông tin bắt buộc ── */}
            <Text style={styles.sectionLabel}>Thông tin bắt buộc</Text>

            {/* Họ và tên */}
            <Text style={styles.label}>Họ và tên <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
                style={[styles.input, errors.fullName ? styles.inputError : null]}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#B0C4A8"
                value={fullName}
                onChangeText={onChangeFullName}
                editable={!loading}
            />
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

            {/* Email */}
            <Text style={styles.label}>Email <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="you@example.com"
                placeholderTextColor="#B0C4A8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={onChangeEmail}
                editable={!loading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            {/* Mật khẩu */}
            <Text style={styles.label}>Mật khẩu <Text style={styles.asterisk}>*</Text></Text>
            <View style={[styles.passwordWrapper, errors.password ? styles.inputError : null]}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Ít nhất 6 ký tự"
                    placeholderTextColor="#B0C4A8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={onChangePassword}
                    editable={!loading}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={onTogglePassword} disabled={loading}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CB890" />
                </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* Nhập lại mật khẩu */}
            <Text style={styles.label}>Nhập lại mật khẩu <Text style={styles.asterisk}>*</Text></Text>
            <View style={[styles.passwordWrapper, errors.rePassword ? styles.inputError : null]}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Trùng khớp với mật khẩu"
                    placeholderTextColor="#B0C4A8"
                    secureTextEntry={!showRePassword}
                    value={rePassword}
                    onChangeText={onChangeRePassword}
                    editable={!loading}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={onToggleRePassword} disabled={loading}>
                    <Ionicons name={showRePassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CB890" />
                </TouchableOpacity>
            </View>
            {errors.rePassword ? <Text style={styles.errorText}>{errors.rePassword}</Text> : null}

            {/* ── SECTION 2: Hồ sơ cá nhân ── */}
            <Text style={[styles.sectionLabel, styles.sectionLabelOptional]}>Hồ sơ cá nhân (Tùy chọn)</Text>

            {/* Số điện thoại */}
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
                style={[styles.input, errors.phoneNumber ? styles.inputError : null]}
                placeholder="0912345678"
                placeholderTextColor="#B0C4A8"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={onChangePhoneNumber}
                editable={!loading}
            />
            {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

            {/* Năm sinh + Giới tính (2 cột) */}
            <View style={styles.row}>
                <View style={styles.rowItem}>
                    <Text style={styles.label}>Năm sinh</Text>
                    <TextInput
                        style={[styles.input, errors.birthYear ? styles.inputError : null]}
                        placeholder="2000"
                        placeholderTextColor="#B0C4A8"
                        keyboardType="numeric"
                        maxLength={4}
                        value={birthYear}
                        onChangeText={onChangeBirthYear}
                        editable={!loading}
                    />
                    {errors.birthYear ? <Text style={styles.errorText}>{errors.birthYear}</Text> : null}
                </View>

                <View style={styles.rowItem}>
                    <Text style={styles.label}>Giới tính</Text>
                    <View style={styles.genderRow}>
                        {GENDER_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.genderBtn, gender === opt.value && styles.genderBtnActive]}
                                onPress={() => onChangeGender(opt.value)}
                                disabled={loading}
                            >
                                <Text style={[styles.genderBtnText, gender === opt.value && styles.genderBtnTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* Địa chỉ */}
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
                style={styles.input}
                placeholder="Ví dụ: TP.HCM, Hà Nội"
                placeholderTextColor="#B0C4A8"
                value={address}
                onChangeText={onChangeAddress}
                editable={!loading}
            />

            {/* ── Nút Chọn ảnh đại diện ── */}
            <Text style={styles.label}>Ảnh đại diện</Text>
            <TouchableOpacity
                style={[
                    styles.avatarBtn,
                    avatarFileName ? styles.avatarBtnActive : null
                ]}
                onPress={onSelectAvatar}
                disabled={loading}
            >
                <Text style={[
                    styles.avatarBtnText,
                    avatarFileName ? styles.avatarBtnTextActive : null
                ]}>
                    {avatarFileName ? `✓ ${avatarFileName}` : "📷 Chọn ảnh đại diện"}
                </Text>
            </TouchableOpacity>

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

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={onGoLogin} disabled={loading}>
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
        marginBottom: 24,
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
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        color: '#7CB342',
        marginBottom: 12,
        marginTop: 4,
    },
    sectionLabelOptional: {
        color: '#AAAAAA',
        marginTop: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 6,
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
        marginBottom: 10,
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
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 4,
    },
    rowItem: {
        flex: 1,
    },
    genderRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 4,
    },
    genderBtn: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderBtnActive: {
        borderColor: '#7CB342',
        backgroundColor: '#F1F8E9',
    },
    genderBtnText: {
        fontSize: 13,
        color: '#888888',
        fontWeight: '500',
    },
    genderBtnTextActive: {
        color: '#7CB342',
        fontWeight: '700',
    },
    avatarBtn: {
        height: 50,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16, // Khoảng cách tới nút Đăng Ký
    },
    avatarBtnActive: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E9',
    },
    avatarBtnText: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    avatarBtnTextActive: {
        color: '#2E7D32',
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#7CB342',
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
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
