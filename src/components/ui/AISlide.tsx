import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onDone: () => void;
}

const AI_FEATURES = [
    { icon: 'mic-outline'       as const, label: 'Chấm điểm phát âm tức thì'           },
    { icon: 'analytics-outline' as const, label: 'Phân tích điểm yếu & gợi ý cải thiện' },
    { icon: 'repeat-outline'    as const, label: 'Flashcard thông minh '    },
];

export default function AISlide({ onDone }: Props) {
    const iconAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const cardTransY = cardAnim.interpolate({ inputRange: [0,1], outputRange: [50,0] });
    const iconScale  = iconAnim.interpolate({ inputRange: [0,1], outputRange: [0.6,1] });

    useEffect(() => {
        Animated.sequence([
            Animated.spring(iconAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
            Animated.timing(cardAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAF7]">
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAF7" />

            {/* Skip */}
            <View className="flex-row justify-end px-6 pt-2 h-10">
                <TouchableOpacity onPress={onDone} activeOpacity={0.7}>
                    <Text className="text-sm font-semibold text-gray-400">Bỏ qua</Text>
                </TouchableOpacity>
            </View>

            {/* AI icon — chiếm phần trên */}
            <View className="flex-1 items-center justify-center">
                <Animated.View
                    style={{ opacity: iconAnim, transform: [{ scale: iconScale }] }}
                    className="items-center"
                >
                    {/* Vòng ngoài */}
                    <View
                        className="w-44 h-44 rounded-full items-center justify-center"
                        style={{ backgroundColor: '#EEF7E4' }}
                    >
                        {/* Vòng trong */}
                        <View
                            className="w-32 h-32 rounded-full items-center justify-center"
                            style={{ backgroundColor: 'rgba(124,179,66,0.15)' }}
                        >
                            {/* TODO: thay bằng ảnh icon AI của bạn nếu có */}
                            <Ionicons name="sparkles" size={64} color="#7CB342" />
                        </View>
                    </View>

                    <Text className="text-lg font-bold text-[#7CB342] mt-4 tracking-wide">
                        AI TREEdu
                    </Text>
                </Animated.View>
            </View>

            {/* Card phía dưới */}
            <Animated.View
                style={[
                    { opacity: cardAnim, transform: [{ translateY: cardTransY }] },
                    {
                        margin: 20,
                        marginBottom: 24,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 24,
                        padding: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 16,
                        elevation: 8,
                    },
                ]}
            >
                <Text className="text-[20px] font-extrabold text-gray-900 mb-1.5">
                    Trợ lý AI thông minh
                </Text>
                <Text className="text-[13px] text-gray-500 leading-5 mb-5">
                    Công nghệ AI tiên tiến giúp bạn học Tiếng Việt hiệu quả hơn bao giờ hết.
                </Text>

                {/* Feature list */}
                <View style={{ gap: 12, marginBottom: 28 }}>
                    {AI_FEATURES.map((feat, i) => (
                        <View key={i} className="flex-row items-center" style={{ gap: 12 }}>
                            <View
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: '#EEF7E4', flexShrink: 0 }}
                            >
                                <Ionicons name={feat.icon} size={16} color="#7CB342" />
                            </View>
                            <Text className="text-[13px] text-gray-700 font-medium flex-1">
                                {feat.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Dots */}
                <View className="flex-row justify-center mb-6" style={{ gap: 6 }}>
                    <View className="w-2 h-2 rounded-full bg-gray-200" />
                    <View className="w-2 h-2 rounded-full bg-gray-200" />
                    <View className="w-6 h-2 rounded-full bg-[#7CB342]" />
                </View>

                {/* Start button */}
                <TouchableOpacity
                    className="h-[54px] bg-[#7CB342] rounded-2xl items-center justify-center"
                    style={{
                        shadowColor: '#7CB342',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.30,
                        shadowRadius: 12,
                        elevation: 5,
                    }}
                    activeOpacity={0.85}
                    onPress={onDone}
                >
                    <Text className="text-base font-bold text-white tracking-wide">
                        BẮT ĐẦU HỌC NGAY
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}
