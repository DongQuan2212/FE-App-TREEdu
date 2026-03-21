import React, { useEffect, useRef } from 'react';
import {
    View, Text, ImageBackground,
    TouchableOpacity, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    onNext: () => void;
}

export default function WelcomeSlide({ onNext }: Props) {
    const titleAnim = useRef(new Animated.Value(0)).current;
    const subAnim   = useRef(new Animated.Value(0)).current;
    const btnAnim   = useRef(new Animated.Value(0)).current;

    const titleTransY = titleAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
    const subTransY   = subAnim.interpolate({   inputRange: [0, 1], outputRange: [30, 0] });

    useEffect(() => {
        Animated.stagger(200, [
            Animated.timing(titleAnim, { toValue: 1, duration: 550, useNativeDriver: true }),
            Animated.timing(subAnim,   { toValue: 1, duration: 550, useNativeDriver: true }),
            Animated.timing(btnAnim,   { toValue: 1, duration: 450, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ImageBackground
                // TODO: thay bằng ảnh học tập của bạn
                source={require('../../../assets/images/study.jpg')}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                {/* Dark overlay */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(10, 30, 10, 0.52)',
                    }}
                />

                <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 28, paddingBottom: 40 }}>

                    {/* Tiêu đề */}
                    <Animated.Text
                        style={{
                            opacity: titleAnim,
                            transform: [{ translateY: titleTransY }],
                            fontSize: 30,
                            fontWeight: '800',
                            color: '#FFFFFF',
                            lineHeight: 38,
                            marginBottom: 12,
                        }}
                    >
                        Cảm ơn bạn{'\n'}đã chọn{' '}
                        <Text style={{ color: '#A8D96C' }}>TREEdu</Text>!
                    </Animated.Text>

                    {/* Mô tả */}
                    <Animated.Text
                        style={{
                            opacity: subAnim,
                            transform: [{ translateY: subTransY }],
                            color: 'rgba(255,255,255,0.82)',
                            fontSize: 14,
                            lineHeight: 24,
                            marginBottom: 40,
                        }}
                    >
                        Hành trình chinh phục Tiếng Việt của bạn bắt đầu từ đây. Học thông minh, tiến bộ mỗi ngày.
                    </Animated.Text>

                    {/* Dots */}
                    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 28 }}>
                        <View style={{ width: 8,  height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                        <View style={{ width: 24, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' }} />
                        <View style={{ width: 8,  height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                    </View>

                    {/* Nút Tiếp theo */}
                    <Animated.View style={{ opacity: btnAnim }}>
                        <TouchableOpacity
                            style={{
                                height: 54,
                                backgroundColor: '#7CB342',
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                elevation: 6,
                            }}
                            activeOpacity={0.85}
                            onPress={onNext}
                        >
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1 }}>
                                TIẾP THEO
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}
