
import { Stack }         from 'expo-router';
import '../global.css';
import { AuthProvider }  from '../src/context/AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                {/* ── Auth / Onboarding ── */}
                <Stack.Screen name="index"           options={{ headerShown: false }} />
                <Stack.Screen name="register"        options={{ headerShown: false }} />
                <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
                <Stack.Screen name="verify"          options={{ headerShown: false }} />
                <Stack.Screen name="reset-password"  options={{ headerShown: false }} />

                {/* ── App chính ── */}
                <Stack.Screen name="tabs"            options={{ headerShown: false }} />
                <Stack.Screen name="dictation/[id]"            options={{ headerShown: false }} />

                {/* ── Dynamic routes ── */}
                <Stack.Screen name="quiz/[id]"             options={{ headerShown: false }} />
                <Stack.Screen name="flashcard/[id]"        options={{ headerShown: false }} />
                <Stack.Screen name="flashcard/create"      options={{ headerShown: false }} />
                <Stack.Screen name="flashcard/[id]/learn"  options={{ headerShown: false }} />
                <Stack.Screen name="pronunciation/[topic]"      options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}
