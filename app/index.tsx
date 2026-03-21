import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOnboarding }   from '@/src/hooks/useOnboarding';
import OnboardingScreen    from '../src/components/ui/OnboardingScreen';
import LoginScreen         from '../src/components/auth/LoginScreen';

export default function IndexScreen() {
    const { hasSeenOnboarding, completeOnboarding } = useOnboarding();

    // ── 1. Đang đọc AsyncStorage → spinner ───────────────
    if (hasSeenOnboarding === null) {
        return (
            <SafeAreaView className="flex-1 bg-[#F0FAEA] items-center justify-center">
                <ActivityIndicator size="large" color="#7CB342" />
            </SafeAreaView>
        );
    }

    // ── 2. Chưa xem onboarding → hiện 3 slides ───────────
    // Khi nhấn BẮT ĐẦU: completeOnboarding() lưu AsyncStorage
    // → hasSeenOnboarding thành true → re-render → xuống case 3
    if (!hasSeenOnboarding) {
        return <OnboardingScreen onDone={completeOnboarding} />;
    }

    // ── 3. Đã xem onboarding → thẳng vào Login ───────────
    return <LoginScreen />;
}
