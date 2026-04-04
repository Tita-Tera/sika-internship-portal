'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InternshipSchema, type InternshipFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect } from 'react';
import { Briefcase, BarChart2, Clock, CalendarCheck, FileText } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all duration-150';

const labelClass = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5';

const errorClass = 'text-red-500 text-xs mt-1.5';

function FieldIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
      {icon}
    </div>
  );
}

const specialties = [
  'Frontend Development',
  'Backend Node.js',
  'Backend PHP',
  'UI/UX Design',
  'Digital Marketing',
  'Mobile Development',
  'Data Science',
  'DevOps',
  'Cybersecurity',
  'Other',
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

        {/* Specialty */}
        <div>
          <label className={labelClass}>Specialty / Role <span className="text-emerald-500">*</span></label>
          <div className="relative">
            <FieldIcon icon={<Briefcase className="w-3.5 h-3.5" />} />
            <select {...register('specialty')} className={`${inputClass} pl-9 appearance-none`}>
              <option value="">Select a specialty</option>
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {errors.specialty && <p className={errorClass}>· {errors.specialty.message}</p>}
        </div>

        {/* Experience + Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Experience Level <span className="text-emerald-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<BarChart2 className="w-3.5 h-3.5" />} />
              <select {...register('experienceLevel')} className={`${inputClass} pl-9 appearance-none`}>
                <option value="">Select level</option>
                <option value="Beginner">Beginner (0–6 months)</option>
                <option value="Intermediate">Intermediate (6–18 months)</option>
                <option value="Advanced">Advanced (1+ years)</option>
              </select>
            </div>
            {errors.experienceLevel && <p className={errorClass}>· {errors.experienceLevel.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Preferred Duration <span className="text-emerald-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<Clock className="w-3.5 h-3.5" />} />
              <select {...register('duration')} className={`${inputClass} pl-9 appearance-none`}>
                <option value="">Select duration</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year (full-time)</option>
              </select>
            </div>
            {errors.duration && <p className={errorClass}>· {errors.duration.message}</p>}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className={labelClass}>Availability <span className="text-emerald-500">*</span></label>
          <div className="relative">
            <FieldIcon icon={<CalendarCheck className="w-3.5 h-3.5" />} />
            <select {...register('availability')} className={`${inputClass} pl-9 appearance-none`}>
              <option value="">When can you start?</option>
              <option value="Immediately">Immediately</option>
              <option value="Within 2 weeks">Within 2 weeks</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          {errors.availability && <p className={errorClass}>· {errors.availability.message}</p>}
        </div>

        {/* Work experience */}
        <div>
          <label className={labelClass}>
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
          {errors.workExperience && <p className={errorClass}>· {errors.workExperience.message}</p>}
        </div>

        <p className="text-[11px] text-zinc-400 pt-1">
          Fields marked <span className="text-emerald-500 font-semibold">*</span> are required.
        </p>
      </div>
    </StepWrapper>
  );
}