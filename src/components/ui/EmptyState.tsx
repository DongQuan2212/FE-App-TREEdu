import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    message: string;
}

export default function EmptyState({ icon, message }: Props) {
    return (
        <View className="items-center py-16 gap-3">
            <Ionicons name={icon} size={48} color="#D1D5DB" />
            <Text className="text-sm text-gray-400 font-medium">{message}</Text>
        </View>
    );
}
