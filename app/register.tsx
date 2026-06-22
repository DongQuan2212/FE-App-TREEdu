import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegister } from '../src/hooks/useRegister';
import RegisterForm from '../src/components/auth/RegisterForm';

export default function RegisterScreen() {
    const router = useRouter();
    const {
        fullName, setFullName,
        email, setEmail,
        password, setPassword,
        rePassword, setRePassword,
        phoneNumber, setPhoneNumber,
        avatarUrl, setAvatarUrl,
        birthYear, setBirthYear,
        address, setAddress,
        gender, setGender,
        showPassword, setShowPassword,
        showRePassword, setShowRePassword,
        loading, errors,
        clearError,
        handleRegister,
    } = useRegister();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0FAEA" />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <RegisterForm
                    fullName={fullName}
                    email={email}
                    password={password}
                    rePassword={rePassword}
                    phoneNumber={phoneNumber}
                    avatarUrl={avatarUrl}
                    birthYear={birthYear}
                    address={address}
                    gender={gender}
                    showPassword={showPassword}
                    showRePassword={showRePassword}
                    loading={loading}
                    errors={errors}
                    onChangeFullName={(text) => { setFullName(text); clearError('fullName'); }}
                    onChangeEmail={(text) => { setEmail(text); clearError('email'); }}
                    onChangePassword={(text) => { setPassword(text); clearError('password'); }}
                    onChangeRePassword={(text) => { setRePassword(text); clearError('rePassword'); }}
                    onChangePhoneNumber={(text) => { setPhoneNumber(text); clearError('phoneNumber'); }}
                    onChangeAvatarUrl={setAvatarUrl}
                    onChangeBirthYear={(text) => { setBirthYear(text); clearError('birthYear'); }}
                    onChangeAddress={setAddress}
                    onChangeGender={setGender}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    onToggleRePassword={() => setShowRePassword(!showRePassword)}
                    onSubmit={handleRegister}
                    onGoLogin={() => router.replace('/' as any)}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0FAEA' },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
});
