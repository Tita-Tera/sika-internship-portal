import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AboutData, EducationData, InternshipData, UploadsData } from '../types/application';

export interface ApplicationFormData {
  about?: AboutData;
  education?: EducationData;
  internship?: InternshipData;
  uploads?: UploadsData;
  applicationId?: string;
}

interface ApplicationState {
  currentStep: number;
  formData: ApplicationFormData;
  setCurrentStep: (step: number) => void;
  updateFormData: <K extends keyof ApplicationFormData>(section: K, data: Partial<ApplicationFormData[K]>) => void;
  resetForm: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      setCurrentStep: (step: number) => set({ currentStep: step }),
      updateFormData: <K extends keyof ApplicationFormData>(section: K, data: Partial<ApplicationFormData[K]>) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [section]: { ...(state.formData[section] as object || {}), ...data },
          },
        })),
      resetForm: () => set({ currentStep: 1, formData: {} }),
    }),
    {
      name: 'sika-application-storage',
      onRehydrateStorage: () => (state) => {
        if (state && typeof state.currentStep !== 'number') {
          state.currentStep = 1;
        }
      },
    }
  )
);