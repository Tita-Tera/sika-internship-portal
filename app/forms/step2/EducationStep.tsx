'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EducationSchema, type EducationFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect } from 'react';
import { GraduationCap, MapPin, BookOpen, Layers } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all duration-150';

const labelClass = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5';

const errorClass = 'text-red-500 text-xs mt-1.5';

function FieldIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
      {icon}
    </div>
  );
}

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

        {/* School name */}
        <div>
          <label className={labelClass}>School / University <span className="text-violet-500">*</span></label>
          <div className="relative">
            <FieldIcon icon={<GraduationCap className="w-3.5 h-3.5" />} />
            <input
              {...register('schoolName')}
              className={`${inputClass} pl-9`}
              placeholder="University of Douala"
            />
          </div>
          {errors.schoolName && <p className={errorClass}>· {errors.schoolName.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className={labelClass}>School Location <span className="text-violet-500">*</span></label>
          <div className="relative">
            <FieldIcon icon={<MapPin className="w-3.5 h-3.5" />} />
            <input
              {...register('schoolLocation')}
              className={`${inputClass} pl-9`}
              placeholder="Douala, Cameroon"
            />
          </div>
          {errors.schoolLocation && <p className={errorClass}>· {errors.schoolLocation.message}</p>}
        </div>

        {/* Field of study */}
        <div>
          <label className={labelClass}>Field of Study / Major <span className="text-violet-500">*</span></label>
          <div className="relative">
            <FieldIcon icon={<BookOpen className="w-3.5 h-3.5" />} />
            <input
              {...register('fieldOfStudy')}
              className={`${inputClass} pl-9`}
              placeholder="Computer Science"
            />
          </div>
          {errors.fieldOfStudy && <p className={errorClass}>· {errors.fieldOfStudy.message}</p>}
        </div>

        {/* Level + Program */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current Year / Level <span className="text-violet-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<Layers className="w-3.5 h-3.5" />} />
              <select {...register('level')} className={`${inputClass} pl-9 appearance-none`}>
                <option value="">Select year</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>
            {errors.level && <p className={errorClass}>· {errors.level.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Program <span className="text-violet-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<GraduationCap className="w-3.5 h-3.5" />} />
              <select {...register('program')} className={`${inputClass} pl-9 appearance-none`}>
                <option value="HND">HND</option>
                <option value="Degree">Degree</option>
                <option value="Masters">Masters</option>
              </select>
            </div>
          </div>
        </div>

        {/* Previous internship */}
        <div>
          <label className={labelClass}>
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