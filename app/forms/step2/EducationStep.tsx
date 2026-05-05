'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EducationSchema, type EducationFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect } from 'react';
import { GraduationCap, MapPin, BookOpen, Layers } from 'lucide-react';
import { FormField, SelectField, inputClass } from '../../components/form/FormField';

export default function EducationStep() {
  const { updateFormData, formData } = useApplicationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EducationFormData>({
    resolver: zodResolver(EducationSchema),
    defaultValues: {
      schoolName: '',
      schoolLocation: '',
      fieldOfStudy: '',
      level: '',
      program: 'Degree',
      previousInternship: '',
    },
  });

  // Rehydrate form whenever we return to this step
  useEffect(() => {
    if (formData.education && Object.keys(formData.education).length > 0) {
      reset(formData.education as EducationFormData);
    }
  }, [formData.education, reset]);

  const handleNext = (proceed: () => void) => {
    handleSubmit((data) => {
      updateFormData('education', data);
      proceed();
    })();
  };

  return (
    <StepWrapper
      title="Education Background"
      description="Tell us about your academic journey"
      onNext={handleNext}
    >
      <div className="space-y-5">

        <FormField label="School / University" required error={errors.schoolName} icon={<GraduationCap className="w-3.5 h-3.5" />}>
          <input {...register('schoolName')} placeholder="University of Douala" />
        </FormField>

        <FormField label="School Location" required error={errors.schoolLocation} icon={<MapPin className="w-3.5 h-3.5" />}>
          <input {...register('schoolLocation')} placeholder="Douala, Cameroon" />
        </FormField>

        <FormField label="Field of Study / Major" required error={errors.fieldOfStudy} icon={<BookOpen className="w-3.5 h-3.5" />}>
          <input {...register('fieldOfStudy')} placeholder="Computer Science" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Current Year / Level"
            required
            error={errors.level}
            icon={<Layers className="w-3.5 h-3.5" />}
            {...register('level')}
            options={[
              { value: '', label: 'Select year' },
              { value: 'Year 1', label: 'Year 1' },
              { value: 'Year 2', label: 'Year 2' },
              { value: 'Year 3', label: 'Year 3' },
              { value: 'Year 4', label: 'Year 4' },
            ]}
          />
          <SelectField
            label="Program"
            required
            error={errors.program}
            icon={<GraduationCap className="w-3.5 h-3.5" />}
            {...register('program')}
            options={[
              { value: 'HND', label: 'HND' },
              { value: 'Degree', label: 'Degree' },
              { value: 'Masters', label: 'Masters' },
            ]}
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
            Previous Internship
            <span className="ml-2 normal-case font-normal text-zinc-300 tracking-normal">optional</span>
          </label>
          <textarea
            {...register('previousInternship')}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Briefly describe any previous internship experience..."
          />
        </div>

        <p className="text-[11px] text-zinc-400 pt-1">
          Fields marked <span className="text-violet-500 font-semibold">*</span> are required.
        </p>
      </div>
    </StepWrapper>
  );
}