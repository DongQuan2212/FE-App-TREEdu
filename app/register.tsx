import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRegister } from '../src/hooks/useRegister';
import RegisterForm from '../src/components/auth/RegisterForm';

export default function RegisterScreen() {
    const router = useRouter();

    // 1. Thêm state quản lý file ảnh được chọn
    const [avatarFile, setAvatarFile] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const {
        fullName, setFullName,
        email, setEmail,
        password, setPassword,
        rePassword, setRePassword,
        phoneNumber, setPhoneNumber,
        // avatarUrl, setAvatarUrl, // Bạn có thể xóa 2 cái này bên trong useRegister hook
        birthYear, setBirthYear,
        address, setAddress,
        gender, setGender,
        showPassword, setShowPassword,
        showRePassword, setShowRePassword,
        loading, errors,
        clearError,
        handleRegister,
    } = useRegister();

    // 2. Hàm gọi thư viện ảnh
    const handleSelectAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập ảnh để sử dụng tính năng này!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ chọn ảnh
            allowsEditing: true, // Cho người dùng cắt ảnh
            aspect: [1, 1],      // Cắt theo tỉ lệ vuông 1:1
            quality: 0.8,        // Giảm dung lượng ảnh xuống 80%
        });

        if (!result.canceled) {
            setAvatarFile(result.assets[0]);
        }
    };

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
                    birthYear={birthYear}
                    address={address}
                    gender={gender}
                    showPassword={showPassword}
                    showRePassword={showRePassword}
                    loading={loading}
                    errors={errors}

                    // 3. Truyền prop ảnh mới vào Form
                    avatarFileName={avatarFile ? (avatarFile.fileName || 'avatar.jpg') : null}
                    onSelectAvatar={handleSelectAvatar}

                    onChangeFullName={(text) => { setFullName(text); clearError('fullName'); }}
                    onChangeEmail={(text) => { setEmail(text); clearError('email'); }}
                    onChangePassword={(text) => { setPassword(text); clearError('password'); }}
                    onChangeRePassword={(text) => { setRePassword(text); clearError('rePassword'); }}
                    onChangePhoneNumber={(text) => { setPhoneNumber(text); clearError('phoneNumber'); }}
                    onChangeBirthYear={(text) => { setBirthYear(text); clearError('birthYear'); }}
                    onChangeAddress={setAddress}
                    onChangeGender={setGender}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    onToggleRePassword={() => setShowRePassword(!showRePassword)}

                    // 4. Truyền file ảnh vào hàm submit để hook xử lý đẩy lên API
                    onSubmit={() => handleRegister(avatarFile)}

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
