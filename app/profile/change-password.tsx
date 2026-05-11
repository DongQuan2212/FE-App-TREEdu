// app/profile/change-password.tsx
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Alert, ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView }        from 'react-native-safe-area-context';
import { Stack, useRouter }    from 'expo-router';
import { Ionicons }            from '@expo/vector-icons';
import { useChangePassword }   from '@/src/hooks/useChangePassword';

interface FieldState {
    value:   string;
    show:    boolean;
    focused: boolean;
}

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { changePassword, loading } = useChangePassword();

    const [old,     setOld]     = useState<FieldState>({ value: '', show: false, focused: false });
    const [next,    setNext]    = useState<FieldState>({ value: '', show: false, focused: false });
    const [confirm, setConfirm] = useState<FieldState>({ value: '', show: false, focused: false });

    // ── Validation ────────────────────────────────────────────────────────────
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!old.value)              e.old     = 'Vui lòng nhập mật khẩu hiện tại';
        if (!next.value)             e.next    = 'Vui lòng nhập mật khẩu mới';
        else if (next.value.length < 6) e.next = 'Mật khẩu mới ít nhất 6 ký tự';
        if (!confirm.value)          e.confirm = 'Vui lòng xác nhận mật khẩu';
        else if (next.value !== confirm.value) e.confirm = 'Mật khẩu xác nhận không khớp';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleUpdate = async () => {
        if (!validate()) return;

        const result = await changePassword({
            oldPassword: old.value,
            newPassword: next.value,
        });

        if (result.success) {
            Alert.alert('Thành công ✓', result.message, [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } else {
            Alert.alert('Thất bại', result.message);
        }
    };

    // ── Field component ───────────────────────────────────────────────────────
    const Field = ({
                       label, placeholder, state, setState, errorKey,
                   }: {
        label:       string;
        placeholder: string;
        state:       FieldState;
        setState:    React.Dispatch<React.SetStateAction<FieldState>>;
        errorKey:    string;
    }) => {
        const hasError = !!errors[errorKey];
        return (
            <View className="mb-1">
                <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    {label}
                </Text>
                <View
                    className="flex-row items-center h-[52px] rounded-2xl px-4 bg-white"
                    style={{
                        borderWidth: state.focused ? 2 : 1,
                        borderColor: hasError
                            ? '#F87171'
                            : state.focused
                                ? '#7CB342'
                                : '#E5E7EB',
                    }}
                >
                    <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        color={hasError ? '#F87171' : state.focused ? '#7CB342' : '#9CA3AF'}
                    />
                    <TextInput
                        className="flex-1 text-sm text-gray-900 ml-3"
                        placeholder={placeholder}
                        placeholderTextColor="#D1D5DB"
                        secureTextEntry={!state.show}
                        value={state.value}
                        onChangeText={(t) => {
                            setState(s => ({ ...s, value: t }));
                            if (errors[errorKey]) setErrors(e => ({ ...e, [errorKey]: '' }));
                        }}
                        onFocus={() => setState(s => ({ ...s, focused: true }))}
                        onBlur={() =>  setState(s => ({ ...s, focused: false }))}
                    />
                    <TouchableOpacity
                        onPress={() => setState(s => ({ ...s, show: !s.show }))}
                        className="p-1"
                    >
                        <Ionicons
                            name={state.show ? 'eye-outline' : 'eye-off-outline'}
                            size={18}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                </View>
                {hasError
                    ? <Text className="text-red-400 text-[12px] mt-1.5 ml-1">{errors[errorKey]}</Text>
                    : <View className="mb-4" />
                }
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F4F6F4]">
            <StatusBar barStyle="dark-content" backgroundColor="#F4F6F4" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* ── Header ── */}
            <View className="flex-row items-center px-5 pt-2 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center mr-3"
                >
                    <Ionicons name="arrow-back" size={18} color="#374151" />
                </TouchableOpacity>
                <View>
                    <Text className="text-[20px] font-extrabold text-gray-900">Đổi mật khẩu</Text>
                    <Text className="text-[12px] text-gray-400">Cập nhật mật khẩu tài khoản</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Info banner ── */}
                <View className="flex-row items-start gap-3 bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                    <Ionicons name="shield-checkmark-outline" size={20} color="#5A8A2E" style={{ marginTop: 1 }} />
                    <Text className="flex-1 text-[13px] text-green-800 leading-5">
                        Mật khẩu mới phải có ít nhất 6 ký tự. Sau khi đổi thành công, hãy ghi nhớ mật khẩu mới của bạn.
                    </Text>
                </View>

                {/* ── Form card ── */}
                <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
                    <Field
                        label="Mật khẩu hiện tại"
                        placeholder="Nhập mật khẩu đang dùng"
                        state={old}
                        setState={setOld}
                        errorKey="old"
                    />
                    <View className="h-px bg-gray-50 mb-4" />
                    <Field
                        label="Mật khẩu mới"
                        placeholder="Tối thiểu 6 ký tự"
                        state={next}
                        setState={setNext}
                        errorKey="next"
                    />
                    <Field
                        label="Xác nhận mật khẩu mới"
                        placeholder="Nhập lại mật khẩu mới"
                        state={confirm}
                        setState={setConfirm}
                        errorKey="confirm"
                    />
                </View>

                {/* ── Submit ── */}
                <TouchableOpacity
                    className="h-[54px] rounded-2xl items-center justify-center"
                    style={{
                        backgroundColor: loading ? '#A5C880' : '#7CB342',
                        shadowColor:     '#7CB342',
                        shadowOffset:    { width: 0, height: 6 },
                        shadowOpacity:   loading ? 0.10 : 0.30,
                        shadowRadius:    12,
                        elevation:       6,
                    }}
                    onPress={handleUpdate}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading
                        ? <ActivityIndicator color="#FFFFFF" size="small" />
                        : (
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                                <Text className="text-[16px] font-bold text-white tracking-wide">
                                    Cập nhật mật khẩu
                                </Text>
                            </View>
                        )
                    }
                </TouchableOpacity>

                {/* ── Cancel ── */}
                <TouchableOpacity
                    className="h-[48px] rounded-2xl items-center justify-center mt-3"
                    onPress={() => router.back()}
                    disabled={loading}
                    activeOpacity={0.75}
                >
                    <Text className="text-[14px] font-semibold text-gray-400">Huỷ</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
