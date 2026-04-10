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
        showPassword, setShowPassword,
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
                    showPassword={showPassword}
                    loading={loading}
                    errors={errors}
                    onChangeFullName={(text) => { setFullName(text); clearError('fullName'); }}
                    onChangeEmail={(text) => { setEmail(text); clearError('email'); }}
                    onChangePassword={(text) => { setPassword(text); clearError('password'); }}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    onSubmit={handleRegister}
                    onGoLogin={() => router.back()}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FAEA',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
});
