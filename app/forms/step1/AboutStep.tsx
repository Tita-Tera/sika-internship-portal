'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AboutSchema, type AboutFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect } from 'react';
import { User, Phone, Calendar, Globe, Users } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-150';

const labelClass = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5';

const errorClass = 'text-red-500 text-xs mt-1.5 flex items-center gap-1';

function FieldIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
      {icon}
    </div>
  );
}

export default function AboutStep() {
  const { updateFormData, formData } = useApplicationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AboutFormData>({
    resolver: zodResolver(AboutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      nationality: '',
      phone: '',
      dateOfBirth: '',
      language: 'English',
      gender: 'Male',
    },
  });

  useEffect(() => {
    if (formData.about && Object.keys(formData.about).length > 0) {
      reset(formData.about as AboutFormData);
    }
  }, [formData.about, reset]);

  const handleNext = (proceed: () => void) => {
    handleSubmit((data) => {
      updateFormData('about', data);
      proceed();
    })();
  };

  return (
    <StepWrapper
      title="About You"
      description="Personal details for your application"
      onNext={handleNext}
    >
      <div className="space-y-5">

        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name <span className="text-blue-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<User className="w-3.5 h-3.5" />} />
              <input
                {...register('firstName')}
                className={`${inputClass} pl-9`}
                placeholder="John"
              />
            </div>
            {errors.firstName && <p className={errorClass}>· {errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Last Name <span className="text-blue-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<User className="w-3.5 h-3.5" />} />
              <input
                {...register('lastName')}
                className={`${inputClass} pl-9`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && <p className={errorClass}>· {errors.lastName.message}</p>}
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label className={labelClass}>Nationality <span className="text-blue-500">*</span></label>
          <div className="relative">
            <FieldIcon icon={<Globe className="w-3.5 h-3.5" />} />
            <input
              {...register('nationality')}
              className={`${inputClass} pl-9`}
              placeholder="e.g. Cameroonian"
            />
          </div>
          {errors.nationality && <p className={errorClass}>· {errors.nationality.message}</p>}
        </div>

        {/* Phone + DOB */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>WhatsApp Phone <span className="text-blue-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<Phone className="w-3.5 h-3.5" />} />
              <input
                {...register('phone')}
                type="tel"
                className={`${inputClass} pl-9`}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
            {errors.phone && <p className={errorClass}>· {errors.phone.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Date of Birth <span className="text-blue-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<Calendar className="w-3.5 h-3.5" />} />
              <input
                {...register('dateOfBirth')}
                type="date"
                className={`${inputClass} pl-9`}
              />
            </div>
            {errors.dateOfBirth && <p className={errorClass}>· {errors.dateOfBirth.message}</p>}
          </div>
        </div>

        {/* Language + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Preferred Language <span className="text-blue-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<Globe className="w-3.5 h-3.5" />} />
              <select {...register('language')} className={`${inputClass} pl-9 appearance-none`}>
                <option value="English">English</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Gender <span className="text-blue-500">*</span></label>
            <div className="relative">
              <FieldIcon icon={<Users className="w-3.5 h-3.5" />} />
              <select {...register('gender')} className={`${inputClass} pl-9 appearance-none`}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Helper note */}
        <p className="text-[11px] text-zinc-400 pt-1">
          Fields marked <span className="text-blue-500 font-semibold">*</span> are required.
        </p>
      </div>
    </StepWrapper>
  );
}