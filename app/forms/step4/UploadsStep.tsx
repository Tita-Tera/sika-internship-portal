'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadsSchema, type UploadsFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect, useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon, CheckCircle2, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinary';

const inputClass =
  'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all duration-150';

const labelClass = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5';

interface UploadCardProps {
  id: string;
  label: string;
  hint: string;
  accept: string;
  icon: React.ReactNode;
  uploaded: boolean;
  uploading?: boolean;
  fileName?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

function UploadCard({
  id, label, hint, accept, icon,
  uploaded, uploading, fileName, required,
  onChange, onClear,
}: UploadCardProps) {
  return (
    <div className={`group relative border rounded-2xl transition-all duration-200 overflow-hidden ${
      uploading
        ? 'border-amber-200 bg-amber-50/40'
        : uploaded
        ? 'border-green-200 bg-green-50/50'
        : 'border-zinc-200 bg-zinc-50/50 hover:border-amber-300 hover:bg-amber-50/30'
    }`}>
      {uploading ? (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-amber-600 mt-0.5">Uploading…</p>
          </div>
        </div>
      ) : uploaded ? (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-green-700 truncate mt-0.5">{fileName || 'File uploaded'}</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label htmlFor={id} className="flex items-center gap-4 px-5 py-4 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-700">
              {label}
              {required && <span className="text-amber-500 ml-1">*</span>}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">{hint}</p>
          </div>
          <div className="shrink-0">
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 group-hover:border-amber-300 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
              <Upload className="w-3 h-3" />
              Upload
            </span>
          </div>
          <input type="file" id={id} accept={accept} onChange={onChange} className="hidden" />
        </label>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a human-readable, stable application ID.
 * Pattern: sika_{firstName}_{lastName}_{timestamp}
 * e.g.    sika_elizabeth_ngum_1775264866435
 */
function buildApplicationId(formData: any): string {
  const firstName = (formData?.about?.firstName || 'applicant')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const lastName = (formData?.about?.lastName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const namePart = lastName ? `${firstName}_${lastName}` : firstName;
  return `teratechcompany-internship_${namePart}_${Date.now()}`;
}

type UploadField = 'cvUrl' | 'applicationLetterUrl' | 'passportPhotoUrl' | 'supportLetterUrl';

const FILE_TYPE_MAP: Record<UploadField, 'cv' | 'application-letter' | 'passport' | 'support-letter'> = {
  cvUrl:                'cv',
  applicationLetterUrl: 'application-letter',
  passportPhotoUrl:     'passport',
  supportLetterUrl:     'support-letter',
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function UploadsStep() {
  const { updateFormData, formData } = useApplicationStore();

  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  /**
   * useRef guarantees one stable ID for the entire component lifetime.
   * - If the store already has an applicationId (returning user), reuse it.
   * - Otherwise generate a new one from the applicant's name + timestamp.
   * This prevents the bug where calling a plain function multiple times
   * generates a different ID each time, splitting files across folders.
   */
  const applicationIdRef = useRef<string>(
    (formData as any)?.applicationId ?? buildApplicationId(formData)
  );

  // Persist the ID into Zustand (→ localStorage) once on mount.
  useEffect(() => {
    if (!(formData as any)?.applicationId) {
      updateFormData('applicationId' as any, applicationIdRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UploadsFormData>({
    resolver: zodResolver(UploadsSchema),
    defaultValues: {
      cvUrl: '',
      applicationLetterUrl: '',
      passportPhotoUrl: '',
      supportLetterUrl: '',
      socialLinks: { linkedin: '', github: '', portfolio: '' },
    },
  });

  // Rehydrate persisted uploads on mount only
  useEffect(() => {
    if (formData.uploads && Object.keys(formData.uploads).length > 0) {
      reset(formData.uploads as UploadsFormData);
      const u = formData.uploads as any;
      const names: Record<string, string> = {};
      if (u.cvUrl)                names.cvUrl                = 'Previously uploaded';
      if (u.applicationLetterUrl) names.applicationLetterUrl = 'Previously uploaded';
      if (u.passportPhotoUrl)     names.passportPhotoUrl     = 'Previously uploaded';
      if (u.supportLetterUrl)     names.supportLetterUrl     = 'Previously uploaded';
      setFileNames(names);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = (proceed: () => void) => {
    handleSubmit((data) => {
      updateFormData('uploads', data);
      proceed();
    })();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: UploadField,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [field]: true }));

    try {
      const url = await uploadToCloudinary(
        file,
        applicationIdRef.current,   // always the same stable ID
        FILE_TYPE_MAP[field],
      );

      setValue(field, url);
      setFileNames((prev) => ({ ...prev, [field]: file.name }));
      updateFormData('uploads', { ...(formData.uploads || {}), [field]: url });
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload ${file.name}. Please try again.`);
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
      e.target.value = ''; // allow re-selecting the same file after a clear
    }
  };

  const handleClear = (field: UploadField) => {
    setValue(field, '');
    setFileNames((prev) => { const n = { ...prev }; delete n[field]; return n; });
    updateFormData('uploads', { ...(formData.uploads || {}), [field]: '' });
  };

  const watched = watch();

  return (
    <StepWrapper
      title="Supporting Documents"
      description="Upload your files and add your online profiles"
      onNext={handleNext}
    >
      <div className="space-y-6">

        {/* Required uploads */}
        <div className="space-y-3">
          <p className={labelClass}>Required Documents</p>

          <UploadCard
            id="cv-upload"
            label="Curriculum Vitae (CV)"
            hint="PDF, DOC, DOCX — max 5 MB"
            accept=".pdf,.doc,.docx"
            icon={<FileText className="w-4 h-4" />}
            uploaded={!!watched.cvUrl}
            uploading={uploading.cvUrl}
            fileName={fileNames.cvUrl}
            required
            onChange={(e) => handleFileChange(e, 'cvUrl')}
            onClear={() => handleClear('cvUrl')}
          />
          {errors.cvUrl && <p className="text-red-500 text-xs -mt-1 ml-1">· {errors.cvUrl.message}</p>}

          <UploadCard
            id="letter-upload"
            label="Application Letter"
            hint="PDF only — max 5 MB"
            accept=".pdf"
            icon={<FileText className="w-4 h-4" />}
            uploaded={!!watched.applicationLetterUrl}
            uploading={uploading.applicationLetterUrl}
            fileName={fileNames.applicationLetterUrl}
            required
            onChange={(e) => handleFileChange(e, 'applicationLetterUrl')}
            onClear={() => handleClear('applicationLetterUrl')}
          />
          {errors.applicationLetterUrl && <p className="text-red-500 text-xs -mt-1 ml-1">· {errors.applicationLetterUrl.message}</p>}

          <UploadCard
            id="photo-upload"
            label="Passport Photo"
            hint="JPG, PNG — max 2 MB"
            accept="image/*"
            icon={<ImageIcon className="w-4 h-4" />}
            uploaded={!!watched.passportPhotoUrl}
            uploading={uploading.passportPhotoUrl}
            fileName={fileNames.passportPhotoUrl}
            required
            onChange={(e) => handleFileChange(e, 'passportPhotoUrl')}
            onClear={() => handleClear('passportPhotoUrl')}
          />
          {errors.passportPhotoUrl && <p className="text-red-500 text-xs -mt-1 ml-1">· {errors.passportPhotoUrl.message}</p>}
        </div>

        {/* Optional */}
        <div className="space-y-3">
          <p className={labelClass}>Optional</p>
          <UploadCard
            id="support-upload"
            label="Support / Recommendation Letter"
            hint="PDF only"
            accept=".pdf"
            icon={<FileText className="w-4 h-4" />}
            uploaded={!!watched.supportLetterUrl}
            uploading={uploading.supportLetterUrl}
            fileName={fileNames.supportLetterUrl}
            onChange={(e) => handleFileChange(e, 'supportLetterUrl')}
            onClear={() => handleClear('supportLetterUrl')}
          />
        </div>

        {/* Social links */}
        <div className="pt-2 border-t border-zinc-100 space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
            <p className={`${labelClass} mb-0`}>
              Online Profiles{' '}
              <span className="normal-case font-normal tracking-normal text-zinc-300">— optional</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'socialLinks.linkedin'  as const, placeholder: 'https://linkedin.com/in/yourname', label: 'LinkedIn'  },
              { name: 'socialLinks.github'    as const, placeholder: 'https://github.com/yourusername',  label: 'GitHub'    },
              { name: 'socialLinks.portfolio' as const, placeholder: 'https://yourportfolio.com',        label: 'Portfolio' },
            ].map((link) => (
              <div key={link.name} className="flex items-center gap-3">
                <span className="text-xs font-medium text-zinc-400 w-16 shrink-0">{link.label}</span>
                <input
                  {...register(link.name)}
                  type="url"
                  className={inputClass}
                  placeholder={link.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Subtle folder path indicator */}
        <p className="text-[11px] text-zinc-300 font-mono truncate" title={applicationIdRef.current}>
          📁 applications/{applicationIdRef.current}/…
        </p>

        <p className="text-[11px] text-zinc-400">
          Fields marked <span className="text-amber-500 font-semibold">*</span> are required.
        </p>
      </div>
    </StepWrapper>
  );
}