// app/profile/edit.tsx
import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, TextInput,
    StatusBar, ActivityIndicator, Alert, Image, Platform,
} from 'react-native';
import { SafeAreaView }  from 'react-native-safe-area-context';
import {Stack, useRouter} from 'expo-router';
import { Ionicons }      from '@expo/vector-icons';
import * as ImagePicker  from 'expo-image-picker';

import axiosClient       from '../../src/constants/axiosClient';
import { API_ENDPOINTS } from '../../src/constants/api';
import { useProfile }    from '../../src/hooks/useProfile';
import { useAuth }       from '../../src/context/AuthContext';

// ── Types ─────────────────────────────────────────────────
type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface FormState {
    fullname:    string;
    phoneNumber: string;
    birthYear:   string;
    address:     string;
    gender:      Gender;
}

// ── Sub-components ────────────────────────────────────────
interface FieldProps {
    label:        string;
    icon:         React.ComponentProps<typeof Ionicons>['name'];
    value:        string;
    onChange:     (v: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'phone-pad';
    editable?:    boolean;
}

function Field({ label, icon, value, onChange, placeholder, keyboardType = 'default', editable = true }: FieldProps) {
    return (

        <View style={{ marginBottom: 16 }}>
            <Stack.Screen  options={{ headerShown: false }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 }}>
                {label}
            </Text>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#FAFAF8',
                borderWidth: 1.5, borderColor: '#E5E7EB',
                borderRadius: 12, paddingHorizontal: 14, height: 48,
            }}>
                <Ionicons name={icon} size={16} color="#9CA3AF" style={{ marginRight: 10 }} />
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor="#D1D5DB"
                    keyboardType={keyboardType}
                    editable={editable}
                    style={{
                        flex: 1, fontSize: 15, color: editable ? '#1a1a1a' : '#9CA3AF',
                        fontWeight: '500',
                    }}
                />
            </View>
        </View>
    );
}

interface GenderPickerProps {
    value:    Gender;
    onChange: (v: Gender) => void;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: 'MALE',   label: 'Nam'   },
    { value: 'FEMALE', label: 'Nữ'    },
    { value: 'OTHER',  label: 'Khác'  },
];

function GenderPicker({ value, onChange }: GenderPickerProps) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 }}>
                Giới tính
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                {GENDER_OPTIONS.map(opt => {
                    const selected = value === opt.value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => onChange(opt.value)}
                            style={{
                                flex: 1, height: 44,
                                borderRadius: 12,
                                borderWidth: 1.5,
                                borderColor: selected ? '#3D7A5C' : '#E5E7EB',
                                backgroundColor: selected ? '#EAF4EE' : '#FAFAF8',
                                alignItems: 'center', justifyContent: 'center',
                            }}
                            activeOpacity={0.75}
                        >
                            <Text style={{
                                fontSize: 14, fontWeight: selected ? '700' : '500',
                                color: selected ? '#2D6A4F' : '#6B7280',
                            }}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// ── Main screen ───────────────────────────────────────────
export default function EditProfileScreen() {
    const router              = useRouter();
    const { user: authUser }  = useAuth();
    const { profile, refetch } = useProfile();

    const [form, setForm] = useState<FormState>({
        fullname:    '',
        phoneNumber: '',
        birthYear:   '',
        address:     '',
        gender:      'MALE',
    });

    // Avatar
    const [avatarUri,     setAvatarUri]     = useState<string | null>(null); // local pick
    const [avatarChanged, setAvatarChanged] = useState(false);

    const [saving, setSaving] = useState(false);

    // Khi profile load xong thì điền vào form
    useEffect(() => {
        if (!profile) return;
        setForm({
            fullname:    profile.fullName    ?? '',
            phoneNumber: profile.phoneNumber ?? '',
            birthYear:   profile.birthYear   ? String(profile.birthYear) : '',
            address:     profile.address     ?? '',
            gender:      (profile.gender as Gender) ?? 'MALE',
        });
        setAvatarUri(profile.avatarUrl ?? null);
    }, [profile]);

    // ── Avatar picker ─────────────────────────────────────
    const handlePickAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri);
            setAvatarChanged(true);
        }
    };

    // ── Save ──────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.fullname.trim()) {
            Alert.alert('Lỗi', 'Họ và tên không được để trống!');
            return;
        }
        if (!profile?.id) return;

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('fullname',    form.fullname.trim());
            fd.append('phoneNumber', form.phoneNumber.trim());
            fd.append('birthYear',   form.birthYear);
            fd.append('address',     form.address.trim());
            fd.append('gender',      form.gender);

            if (avatarChanged && avatarUri) {
                const filename  = avatarUri.split('/').pop() ?? 'avatar.jpg';
                const extension = filename.split('.').pop()  ?? 'jpg';
                const mimeType  = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

                fd.append('avatarFile', {
                    uri:  Platform.OS === 'android' ? avatarUri : avatarUri.replace('file://', ''),
                    name: filename,
                    type: mimeType,
                } as any);
            }

            await axiosClient.put(
                `${API_ENDPOINTS.myProfile.replace('/me', '')}/update-my-profile/${profile.id}`,
                fd,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );

            await refetch();
            Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (err: any) {
            console.error('Update profile error:', err);
            Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể cập nhật hồ sơ, vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    // ── Loading state (profile chưa về) ──────────────────
    if (!profile) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F4', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#3D7A5C" />
            </SafeAreaView>
        );
    }

    const displayAvatar = avatarUri;
    const initials = (form.fullname || 'U')
        .split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F4' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F6F4" />

            {/* ── Header ── */}
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 20, paddingVertical: 14,
                backgroundColor: '#F4F6F4',
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 38, height: 38, borderRadius: 19,
                        backgroundColor: '#fff',
                        borderWidth: 1, borderColor: '#E5E7EB',
                        alignItems: 'center', justifyContent: 'center',
                        marginRight: 12,
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={20} color="#374151" />
                </TouchableOpacity>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1a1a1a', flex: 1 }}>
                    Chỉnh sửa hồ sơ
                </Text>
                {/* Save button in header */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    style={{
                        backgroundColor: '#2D6A4F',
                        borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8,
                        opacity: saving ? 0.6 : 1,
                    }}
                    activeOpacity={0.85}
                >
                    {saving
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Lưu</Text>
                    }
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Avatar picker ── */}
                <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                    <View style={{ position: 'relative' }}>
                        <View style={{
                            width: 96, height: 96, borderRadius: 48,
                            backgroundColor: '#F3F4F0',
                            borderWidth: 2, borderColor: '#E8E8E4',
                            overflow: 'hidden',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            {displayAvatar
                                ? <Image source={{ uri: displayAvatar }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                : <Text style={{ fontSize: 28, fontWeight: '700', color: '#777' }}>{initials}</Text>
                            }
                        </View>
                        {/* Camera badge */}
                        <TouchableOpacity
                            onPress={handlePickAvatar}
                            style={{
                                position: 'absolute', bottom: 0, right: 0,
                                width: 30, height: 30, borderRadius: 15,
                                backgroundColor: '#2D6A4F',
                                borderWidth: 2, borderColor: '#F4F6F4',
                                alignItems: 'center', justifyContent: 'center',
                            }}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="camera" size={15} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handlePickAvatar} style={{ marginTop: 10 }} activeOpacity={0.7}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#2D6A4F' }}>
                            {avatarChanged ? 'Đổi ảnh khác' : 'Thay đổi ảnh đại diện'}
                        </Text>
                    </TouchableOpacity>
                    {avatarChanged && (
                        <TouchableOpacity
                            onPress={() => { setAvatarUri(profile.avatarUrl ?? null); setAvatarChanged(false); }}
                            style={{ marginTop: 4 }}
                            activeOpacity={0.7}
                        >
                            <Text style={{ fontSize: 12, color: '#EF4444' }}>Hoàn tác</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Form card ── */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    borderWidth: 1, borderColor: '#EBEBEB',
                    padding: 20,
                }}>
                    {/* Read-only fields */}
                    <Field
                        label="Email"
                        icon="mail-outline"
                        value={profile.email ?? ''}
                        onChange={() => {}}
                        editable={false}
                    />

                    {/* Editable fields */}
                    <Field
                        label="Họ và tên"
                        icon="person-outline"
                        value={form.fullname}
                        onChange={v => setForm(f => ({ ...f, fullname: v }))}
                        placeholder="Nhập họ và tên"
                    />
                    <Field
                        label="Số điện thoại"
                        icon="call-outline"
                        value={form.phoneNumber}
                        onChange={v => setForm(f => ({ ...f, phoneNumber: v }))}
                        placeholder="0912 345 678"
                        keyboardType="phone-pad"
                    />
                    <Field
                        label="Năm sinh"
                        icon="calendar-outline"
                        value={form.birthYear}
                        onChange={v => setForm(f => ({ ...f, birthYear: v }))}
                        placeholder="2000"
                        keyboardType="numeric"
                    />
                    <Field
                        label="Địa chỉ"
                        icon="location-outline"
                        value={form.address}
                        onChange={v => setForm(f => ({ ...f, address: v }))}
                        placeholder="TP. Hồ Chí Minh"
                    />
                    <GenderPicker
                        value={form.gender}
                        onChange={v => setForm(f => ({ ...f, gender: v }))}
                    />
                </View>

                {/* ── Bottom save button ── */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    style={{
                        marginTop: 20,
                        height: 52,
                        backgroundColor: '#1C1C1C',
                        borderRadius: 14,
                        flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 8,
                        opacity: saving ? 0.6 : 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
                    }}
                    activeOpacity={0.85}
                >
                    {saving
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Lưu thay đổi</Text>
                        </>
                    }
                </TouchableOpacity>

                {/* ── Cancel ── */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}
                    activeOpacity={0.7}
                >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }}>Huỷ thay đổi</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
