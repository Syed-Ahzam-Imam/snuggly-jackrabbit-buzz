import React from 'react';
import OnboardingForm from '../components/OnboardingForm';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Onboarding: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <OnboardingForm />
      <MadeWithDyad />
    </div>
  );
};

export default Onboarding;