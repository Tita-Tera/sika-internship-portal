'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AboutSchema, type AboutFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect } from 'react';
import { User, Mail, Phone, Calendar, Globe, Users } from 'lucide-react';
import { FormField, SelectField } from '../../components/form/FormField';

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
          <FormField label="First Name" required error={errors.firstName} icon={<User className="w-3.5 h-3.5" />}>
            <input {...register('firstName')} placeholder="John" />
          </FormField>
          <FormField label="Last Name" required error={errors.lastName} icon={<User className="w-3.5 h-3.5" />}>
            <input {...register('lastName')} placeholder="Doe" />
          </FormField>
        </div>

        <FormField label="Email Address" required error={errors.email} icon={<Mail className="w-3.5 h-3.5" />}>
          <input {...register('email')} type="email" placeholder="you@example.com" />
        </FormField>

        {/* Nationality */}
        <FormField label="Nationality" required error={errors.nationality} icon={<Globe className="w-3.5 h-3.5" />}>
          <input {...register('nationality')} placeholder="e.g. Cameroonian" />
        </FormField>

        {/* Phone + DOB */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="WhatsApp Phone" required error={errors.phone} icon={<Phone className="w-3.5 h-3.5" />}>
            <input {...register('phone')} type="tel" placeholder="+237 6XX XXX XXX" />
          </FormField>
          <FormField label="Date of Birth" required error={errors.dateOfBirth} icon={<Calendar className="w-3.5 h-3.5" />}>
            <input {...register('dateOfBirth')} type="date" />
          </FormField>
        </div>

        {/* Language + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Preferred Language"
            required
            error={errors.language}
            icon={<Globe className="w-3.5 h-3.5" />}
            {...register('language')}
            options={[
              { value: 'English', label: 'English' },
              { value: 'French', label: 'French' },
            ]}
          />
          <SelectField
            label="Gender"
            required
            error={errors.gender}
            icon={<Users className="w-3.5 h-3.5" />}
            {...register('gender')}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
            ]}
          />
        </div>

        {/* Helper note */}
        <p className="text-[11px] text-zinc-400 pt-1">
          Fields marked <span className="text-blue-500 font-semibold">*</span> are required.
        </p>
      </div>
    </StepWrapper>
  );
}