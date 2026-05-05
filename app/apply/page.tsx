'use client';
import React, { useEffect } from 'react';
import { useApplicationStore } from '../store/useApplicationStore';
import Link from 'next/link';
import AboutStep from '../forms/step1/AboutStep';
import EducationStep from '../forms/step2/EducationStep';
import InternshipStep from '../forms/step3/InternshipStep';
import UploadsStep from '../forms/step4/UploadsStep';
import ReviewStep from '../forms/step5/ReviewStep';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const steps = [
  { id: 1, title: 'About You' },
  { id: 2, title: 'Education' },
  { id: 3, title: 'Internship' },
  { id: 4, title: 'Uploads' },
  { id: 5, title: 'Review' },
];

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: AboutStep,
  2: EducationStep,
  3: InternshipStep,
  4: UploadsStep,
  5: ReviewStep,
};

export default function ApplyPage() {
  const { currentStep } = useApplicationStore();

  // Debug: Log what we're trying to render
  useEffect(() => {
    console.log('Current Step:', currentStep);
    console.log('Component Type:', typeof STEP_COMPONENTS[currentStep]);
  }, [currentStep]);

  const StepComponent = STEP_COMPONENTS[currentStep];

  if (typeof StepComponent !== 'function') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-lg mb-4">Error: Could not load step {currentStep}</p>
          <p className="text-zinc-600 mb-6">Please refresh the page or go back to home.</p>
          <button 
            onClick={() => window.location.href = '/apply'}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <SiteHeader transparent={false} />

      <main className="flex-1 pt-16">
        <div className="max-w-3xl mx-auto px-6 py-12">

          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span>Application</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">
              {steps.find(s => s.id === currentStep)?.title}
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-zinc-900">Sika Internship Application</h1>
            <p className="text-sm text-zinc-400 mt-1">Step {currentStep} of 5</p>
          </div>

          {/* Stepper */}
          <div className="flex justify-between mb-10 relative">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 text-sm font-bold transition-all ${
                  currentStep === step.id ? 'border-blue-600 bg-white text-blue-600' :
                  currentStep > step.id ? 'border-blue-600 bg-blue-600 text-white' :
                  'border-zinc-200 bg-white text-zinc-400'
                }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <span className={`text-xs mt-2 font-medium hidden sm:block ${currentStep >= step.id ? 'text-zinc-800' : 'text-zinc-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}

            <div className="absolute top-5 left-0 right-0 h-[2px] bg-zinc-200 -z-10">
              <div className="h-full bg-blue-600 transition-all duration-500" 
                   style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-8 md:p-10">
            <StepComponent />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}