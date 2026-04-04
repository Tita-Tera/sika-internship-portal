'use client';

import { ReactNode } from 'react';
import { useApplicationStore } from '../store/useApplicationStore';

interface StepWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  onNext?: (proceed: () => void) => void; // form can intercept "Continue"
}

export default function StepWrapper({ children, title, description, onNext }: StepWrapperProps) {
  const { currentStep, setCurrentStep } = useApplicationStore();

  const proceed = () => setCurrentStep(Math.min(5, currentStep + 1));
  const handlePrev = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handleNext = () => {
    if (onNext) {
      onNext(proceed); // delegate to the form; form calls proceed() after saving
    } else {
      proceed();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-zinc-900 mb-2">{title}</h2>
        {description && <p className="text-zinc-600">{description}</p>}
      </div>

      <div className="min-h-[300px]">
        {children}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={handlePrev}
          className="px-8 py-3 border border-zinc-300 rounded-2xl font-medium hover:bg-zinc-50 transition disabled:opacity-50"
          disabled={currentStep === 1}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition"
        >
          {currentStep === 5 ? 'Submit Application' : 'Continue'}
        </button>
      </div>
    </div>
  );
}