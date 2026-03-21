import React, { useState } from 'react';
import SplashSlide  from './SplashSlide';
import WelcomeSlide from './WelcomeSlide';
import AISlide      from './AISlide';

interface Props {
    onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
    const [step, setStep] = useState<0 | 1 | 2>(0);

    if (step === 0) return <SplashSlide  onNext={() => setStep(1)} />;
    if (step === 1) return <WelcomeSlide onNext={() => setStep(2)} />;
    return              <AISlide      onDone={onDone} />;
}
