import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuSection as MenuSectionType } from '../../types/profile.types';

interface Props {
    section: MenuSectionType;
    onPress: (route: string) => void;
}

export default function MenuSection({ section, onPress }: Props) {
    return (
        <View className="mb-4">
            <Text className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {section.title}
            </Text>
            <View className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {section.items.map((item, index) => (
                    <View key={item.id}>
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3.5 gap-3.5"
                            activeOpacity={0.75}
                            onPress={() => onPress(item.route)}
                        >
                            <View
                                className="w-[38px] h-[38px] rounded-[10px] items-center justify-center shrink-0"
                                style={{ backgroundColor: item.bgColor }}
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={18}
                                    color={item.color}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 mb-0.5">
                                    {item.label}
                                </Text>
                                <Text className="text-[11px] text-gray-400">{item.sub}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                        </TouchableOpacity>

                        {index < section.items.length - 1 && (
                            <View className="h-px bg-gray-50 ml-[68px]" />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}
