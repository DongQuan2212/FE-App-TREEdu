import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    onNext: () => void;
}

export default function SplashSlide({ onNext }: Props) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale   = useRef(new Animated.Value(0.85)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.spring(scale,   { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Logo căn giữa */}
            <View className="flex-1 items-center justify-center">
                <Animated.View style={{ opacity, transform: [{ scale }] }}>
                    {/* TODO: thay bằng logo thật */}
                    <Image
                        source={require('../../../assets/images/logo1.png')}
                        style={{ width: 200, height: 80 }}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>

            {/* Nút tiếp theo */}
            <View className="px-8 pb-10">
                <View className="flex-row justify-center gap-1.5 mb-8">
                    <View className="w-6 h-2 rounded-full bg-[#7CB342]" />
                    <View className="w-2 h-2 rounded-full bg-gray-200" />
                    <View className="w-2 h-2 rounded-full bg-gray-200" />
                </View>

                <TouchableOpacity
                    className="h-[54px] bg-[#7CB342] rounded-2xl items-center justify-center"
                    style={{
                        shadowColor: '#7CB342',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.28,
                        shadowRadius: 12,
                        elevation: 5,
                    }}
                    activeOpacity={0.85}
                    onPress={onNext}
                >
                    <Text className="text-base font-bold text-white tracking-wide">TIẾP THEO</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
