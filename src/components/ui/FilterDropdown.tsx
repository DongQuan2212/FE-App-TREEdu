import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Option {
    value: string;
    label: string;
}

interface Props {
    label: string;
    options: Option[];
    selected: string;
    isOpen: boolean;
    alignRight?: boolean;
    showIcon?: boolean;
    onToggle: () => void;
    onSelect: (value: string) => void;
}

export default function FilterDropdown({
                                           label, options, selected, isOpen, alignRight = false, showIcon = false,
                                           onToggle, onSelect,
                                       }: Props) {
    return (
        <View className="relative z-10">
            {/* Trigger button */}
            <TouchableOpacity
                onPress={onToggle}
                className={`flex-row items-center gap-1 h-[38px] px-3 bg-white border rounded-[10px] ${
                    isOpen ? 'border-[#7CB342]' : 'border-gray-200'
                }`}
            >
                {showIcon && (
                    <Ionicons name="swap-vertical-outline" size={13} color="#6B7280" />
                )}
                <Text className="text-xs text-gray-700 font-medium">{label}</Text>
                <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={13}
                    color="#6B7280"
                />
            </TouchableOpacity>

            {/* Dropdown list */}
            {isOpen && (
                <View
                    className={`absolute top-11 min-w-[155px] bg-white border border-gray-200 rounded-xl py-1.5 z-50 shadow-md ${
                        alignRight ? 'right-0' : 'left-0'
                    }`}
                    style={{ elevation: 10 }}
                >
                    {options.map(opt => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => onSelect(opt.value)}
                            className="flex-row justify-between items-center px-4 py-2.5"
                        >
                            <Text
                                className={`text-[13px] ${
                                    selected === opt.value
                                        ? 'text-[#7CB342] font-bold'
                                        : 'text-gray-700'
                                }`}
                            >
                                {opt.label}
                            </Text>
                            {selected === opt.value && (
                                <Ionicons name="checkmark" size={14} color="#7CB342" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}
