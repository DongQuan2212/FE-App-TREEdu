import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import '../../global.css';
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_CONFIG: {
    name: string;
    label: string;
    icon: IoniconsName;
    iconActive: IoniconsName;
}[] = [
    {
        name: "home",
        label: "Trang chủ",
        icon: "home-outline",
        iconActive: "home",
    },
    {
        name: "quiz",
        label: "Bài quiz",
        icon: "grid-outline",
        iconActive: "grid",
    },
    {
        name: "flashcard",
        label: "Flashcard",
        icon: "layers-outline",
        iconActive: "layers",
    },
    {
        name: "pronunciation",
        label: "Phát âm",
        icon: "mic-outline",
        iconActive: "mic",
    },
    {
        name: "dictation",
        label: "Nghe chép",
        icon: "headset-outline",
        iconActive: "headset",
    },
    {
        name: "profile",
        label: "Cá nhân",
        icon: "person-outline",
        iconActive: "person",
    },
];

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#7CB342",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#F3F4F6",
                    height: 74,
                    paddingBottom: 10,
                    paddingTop: 6,
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                },
                tabBarLabelStyle: {
                    // Mẹo nhỏ: Vì giờ có 6 tab, bạn có thể giảm font-size xuống 9 hoặc giữ nguyên 10 tùy màn hình thực tế nhé
                    fontSize: 10,
                    fontWeight: "600",
                    marginTop: 1,
                },
            }}
        >
            {TAB_CONFIG.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.label,
                        tabBarIcon: ({ focused, color }) => (
                            <Ionicons
                                name={focused ? tab.iconActive : tab.icon}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}
