import { Stack } from "expo-router";
import '../global.css';
export default function RootLayout() {
    return (
        <Stack>
            {/* Auth screens — không có header */}
            <Stack.Screen name="index"    options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />

            {/* Tab group — toàn bộ màn hình sau đăng nhập */}
            <Stack.Screen name="tabs"   options={{ headerShown: false }} />
        </Stack>
    );
}
