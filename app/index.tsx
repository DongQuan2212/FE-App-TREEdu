import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function Index() {
    return (
        <View style={styles.container}>

            {/* Phần Logo / Tiêu đề */}
            <View style={styles.header}>
                <Text style={styles.logoText}>TREEdu</Text>
                <Text style={styles.subtitle}>Nền tảng học tập trực tuyến</Text>
            </View>

            {/* Phần Form nhập liệu */}
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email hoặc Tên đăng nhập"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    secureTextEntry={true} // Ẩn mật khẩu thành dấu chấm
                />

                {/* Nút Đăng nhập */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Đăng Nhập</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Màu nền
        justifyContent: 'center',
        paddingHorizontal: 25,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoText: {
        fontSize: 45,
        fontWeight: 'bold',
        color: '#2E7D32', // Màu xanh lá
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: '#FFF',
        height: 55,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2E7D32',
        height: 55,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
