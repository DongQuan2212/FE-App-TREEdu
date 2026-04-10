import React from 'react';
import {
    View, Text, ScrollView, StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useQuizTaking } from '../../src/hooks/useQuizTaking';
import QuestionCard      from '../../src/components/quiz/QuestionCard';
import QuizSidebar       from '../../src/components/quiz/QuizSidebar';
import QuizResult        from '../../src/components/quiz/QuizResult';

export default function QuizTakingScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router  = useRouter();

    const {
        quiz, attemptId, questions,
        currentIdx, setCurrentIdx,
        answers, flags,
        timeLeft, formatTime,
        loading, submitting,
        showResult, result,
        progressPercent, answeredCount,
        selectAnswer, toggleFlag,
        goNext, goPrev,
        handleSubmit, handleRetake,
    } = useQuizTaking(id ?? '');

    // ── Loading ──────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color="#22C55E" />
                <Text className="text-sm text-gray-400 mt-3">Đang tải bài thi...</Text>
            </SafeAreaView>
        );
    }

    // ── Result screen ─────────────────────────────────────
    if (showResult && result && quiz) {
        return (
            <QuizResult
                title={quiz.title}
                result={result}
                onRetake={handleRetake}
                onBack={() => router.back()}
            />
        );
    }

    // ── Active quiz ───────────────────────────────────────
    if (!quiz || questions.length === 0) return null;

    const currentQuestion = questions[currentIdx];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Sidebar / info panel (trên cùng trên mobile) ── */}
                <QuizSidebar
                    title={quiz.title}
                    attemptId={attemptId}
                    timeLeft={timeLeft}
                    formatTime={formatTime}
                    progressPercent={progressPercent}
                    answeredCount={answeredCount}
                    questions={questions}
                    currentIdx={currentIdx}
                    answers={answers}
                    flags={flags}
                    submitting={submitting}
                    onJump={setCurrentIdx}
                    onSubmit={handleSubmit}
                />

                {/* ── Question card ── */}
                <View className="mt-4">
                    <QuestionCard
                        question={currentQuestion}
                        index={currentIdx}
                        total={questions.length}
                        answers={answers}
                        flags={flags}
                        onSelect={selectAnswer}
                        onToggleFlag={toggleFlag}
                        onNext={goNext}
                        onPrev={goPrev}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
