import { Stack } from "expo-router";
import '../global.css';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                {/* Auth screens — không có header */}
                <Stack.Screen name="index"    options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />

                {/* Tab group — toàn bộ màn hình sau đăng nhập */}
                <Stack.Screen name="tabs"   options={{ headerShown: false }} />
                <Stack.Screen name="quiz/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="flashcard/[id]"     options={{ headerShown: false }} />
                <Stack.Screen name="flashcard/create"   options={{ headerShown: false }} />
                <Stack.Screen name="flashcard/[id]/learn"   options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}
