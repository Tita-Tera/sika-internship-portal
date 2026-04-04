import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApplicationFormData {
  about?: any;
  education?: any;
  internship?: any;
  uploads?: any;
}

interface ApplicationState {
  currentStep: number;
  formData: ApplicationFormData;
  setCurrentStep: (step: number) => void;
  updateFormData: (section: keyof ApplicationFormData, data: any) => void;
  resetForm: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: {},
      setCurrentStep: (step) => set({ currentStep: step }),
      updateFormData: (section, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [section]: { ...(state.formData[section] || {}), ...data },
          },
        })),
      resetForm: () => set({ currentStep: 1, formData: {} }),
    }),
    {
      name: 'sika-application-storage',
    }
  )
);