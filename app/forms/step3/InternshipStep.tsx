'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InternshipSchema, type InternshipFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect } from 'react';
import { Briefcase, BarChart2, Clock, CalendarCheck, FileText } from 'lucide-react';
import { SelectField, inputClass } from '../../components/form/FormField';

const specialties = [
  'Frontend Development', 'Backend Node.js', 'Backend PHP', 'UI/UX Design',
  'Digital Marketing', 'Mobile Development', 'Data Science', 'DevOps',
  'Cybersecurity', 'Other',
];

export default function InternshipStep() {
  const { updateFormData, formData } = useApplicationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InternshipFormData>({
    resolver: zodResolver(InternshipSchema),
    defaultValues: {
      specialty: '',
      experienceLevel: '',
      duration: '',
      availability: '',
      workExperience: '',
    },
  });

  // Rehydrate when returning to this step
  useEffect(() => {
    if (formData.internship && Object.keys(formData.internship).length > 0) {
      reset(formData.internship as InternshipFormData);
    }
  }, [formData.internship, reset]);

  const handleNext = (proceed: () => void) => {
    handleSubmit((data) => {
      updateFormData('internship', data);
      proceed();
    })();
  };

  return (
    <StepWrapper
      title="Internship Preferences"
      description="Help us match you to the right opportunity"
      onNext={handleNext}
    >
      <div className="space-y-5">

        <SelectField
          label="Specialty / Role"
          required
          error={errors.specialty}
          icon={<Briefcase className="w-3.5 h-3.5" />}
          {...register('specialty')}
          options={[
            { value: '', label: 'Select a specialty' },
            ...specialties.map(s => ({ value: s, label: s })),
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Experience Level"
            required
            error={errors.experienceLevel}
            icon={<BarChart2 className="w-3.5 h-3.5" />}
            {...register('experienceLevel')}
            options={[
              { value: '', label: 'Select level' },
              { value: 'Beginner', label: 'Beginner (0–6 months)' },
              { value: 'Intermediate', label: 'Intermediate (6–18 months)' },
              { value: 'Advanced', label: 'Advanced (1+ years)' },
            ]}
          />
          <SelectField
            label="Preferred Duration"
            required
            error={errors.duration}
            icon={<Clock className="w-3.5 h-3.5" />}
            {...register('duration')}
            options={[
              { value: '', label: 'Select duration' },
              { value: '1 month', label: '1 month' },
              { value: '2 months', label: '2 months' },
              { value: '3 months', label: '3 months' },
              { value: '6 months', label: '6 months' },
              { value: '1 year', label: '1 year (full-time)' },
            ]}
          />
        </div>

        <SelectField
          label="Availability"
          required
          error={errors.availability}
          icon={<CalendarCheck className="w-3.5 h-3.5" />}
          {...register('availability')}
          options={[
            { value: '', label: 'When can you start?' },
            { value: 'Immediately', label: 'Immediately' },
            { value: 'Within 2 weeks', label: 'Within 2 weeks' },
            { value: 'Within 1 month', label: 'Within 1 month' },
            { value: 'Flexible', label: 'Flexible' },
          ]}
        />

        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
            Relevant Work / Project Experience <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <textarea
              {...register('workExperience')}
              rows={5}
              className={`${inputClass} pl-9 resize-y`}
              placeholder="Describe projects, freelance work, or any relevant hands-on experience..."
            />
          </div>
          {errors.workExperience && <p className="text-red-500 text-xs mt-1.5">· {errors.workExperience.message}</p>}
        </div>

        <p className="text-[11px] text-zinc-400 pt-1">
          Fields marked <span className="text-emerald-500 font-semibold">*</span> are required.
        </p>
      </div>
    </StepWrapper>
  );
}