'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadsSchema, type UploadsFormData } from '../../schemas/application';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { useEffect, useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon, CheckCircle2, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { ApplicationFormData } from '../../types/application';

const inputClass = 'w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all duration-150';
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

function UploadCard({ id, label, hint, accept, icon, uploaded, uploading, fileName, onChange, onClear }: UploadCardProps) {
  return (
    <div className={`group relative border rounded-2xl transition-all duration-200 overflow-hidden ${
      uploading ? 'border-amber-200 bg-amber-50/40' :
      uploaded ? 'border-green-200 bg-green-50/50' :
      'border-zinc-200 bg-zinc-50/50 hover:border-amber-300 hover:bg-amber-50/30'
    }`}>
      {uploading ? (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-amber-600">Uploading...</p>
          </div>
        </div>
      ) : uploaded ? (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium text-green-700 truncate">{fileName || 'File uploaded'}</p>
          </div>
          <button onClick={onClear} className="text-zinc-400 hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label htmlFor={id} className="flex items-center gap-4 px-5 py-4 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-700">{label}</p>
            <p className="text-xs text-zinc-400">{hint}</p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 group-hover:border-amber-300 group-hover:text-amber-600 transition-colors">
            Upload
          </span>
          <input type="file" id={id} accept={accept} onChange={onChange} className="hidden" />
        </label>
      )}
    </div>
  );
}

// Build stable application ID
function buildApplicationId(formData: any): string {
  const first = (formData?.about?.firstName || 'applicant').toLowerCase().replace(/[^a-z0-9]/g, '');
  const last = (formData?.about?.lastName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `teratech_${first}_${last || 'user'}_${Date.now()}`;
}

type UploadField = 'cvUrl' | 'applicationLetterUrl' | 'passportPhotoUrl' | 'supportLetterUrl';

const FILE_TYPE_MAP: Record<UploadField, string> = {
  cvUrl: 'cv',
  applicationLetterUrl: 'application-letter',
  passportPhotoUrl: 'passport',
  supportLetterUrl: 'support-letter',
};

export default function UploadsStep() {
  const { updateFormData, formData } = useApplicationStore();
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const applicationIdRef = useRef<string>(formData.applicationId || buildApplicationId(formData));

  useEffect(() => {
    if (!formData.applicationId) {
      updateFormData('applicationId', applicationIdRef.current);
    }
  }, [formData.applicationId, updateFormData]);

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

  useEffect(() => {
    if (formData.uploads && Object.keys(formData.uploads).length > 0) {
      reset(formData.uploads as UploadsFormData);
    }
  }, [formData.uploads, reset]);

  const handleNext = (proceed: () => void) => {
    handleSubmit((data) => {
      updateFormData('uploads', data);
      proceed();
    })();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: UploadField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [field]: true }));

    try {
      const url = await uploadToCloudinary(file, applicationIdRef.current, FILE_TYPE_MAP[field] as any);
      setValue(field, url);
      setFileNames(prev => ({ ...prev, [field]: file.name }));
      updateFormData('uploads', { ...(formData.uploads || {}), [field]: url });
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleClear = (field: UploadField) => {
    setValue(field, '');
    setFileNames(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const watched = watch();

  return (
    <StepWrapper
      title="Supporting Documents"
      description="Upload your files and add your online profiles"
      onNext={handleNext}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <p className={labelClass}>Required Documents</p>

          <UploadCard
            id="cv"
            label="Curriculum Vitae (CV)"
            hint="PDF, DOC, DOCX — max 5MB"
            accept=".pdf,.doc,.docx"
            icon={<FileText className="w-4 h-4" />}
            uploaded={!!watched.cvUrl}
            uploading={uploading.cvUrl}
            fileName={fileNames.cvUrl}
            onChange={(e) => handleFileChange(e, 'cvUrl')}
            onClear={() => handleClear('cvUrl')}
          />

          <UploadCard
            id="letter"
            label="Application Letter"
            hint="PDF only — max 5MB"
            accept=".pdf"
            icon={<FileText className="w-4 h-4" />}
            uploaded={!!watched.applicationLetterUrl}
            uploading={uploading.applicationLetterUrl}
            fileName={fileNames.applicationLetterUrl}
            onChange={(e) => handleFileChange(e, 'applicationLetterUrl')}
            onClear={() => handleClear('applicationLetterUrl')}
          />

          <UploadCard
            id="photo"
            label="Passport Photo"
            hint="JPG, PNG — max 2MB"
            accept="image/*"
            icon={<ImageIcon className="w-4 h-4" />}
            uploaded={!!watched.passportPhotoUrl}
            uploading={uploading.passportPhotoUrl}
            fileName={fileNames.passportPhotoUrl}
            onChange={(e) => handleFileChange(e, 'passportPhotoUrl')}
            onClear={() => handleClear('passportPhotoUrl')}
          />
        </div>

        {/* Optional Support Letter */}
        <div className="space-y-3">
          <p className={labelClass}>Optional</p>
          <UploadCard
            id="support"
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

        {/* Social Links */}
        <div className="pt-4 border-t border-zinc-100 space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-zinc-400" />
            <p className={labelClass}>Online Profiles <span className="font-normal text-zinc-300">— optional</span></p>
          </div>
          {['linkedin', 'github', 'portfolio'].map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-400 w-20 capitalize">{key}</span>
              <input
                {...register(`socialLinks.${key}` as const)}
                type="url"
                className={inputClass}
                placeholder={`https://${key}.com/yourprofile`}
              />
            </div>
          ))}
        </div>

        <p className="text-[11px] text-zinc-400">
          Fields marked <span className="text-amber-500">*</span> are required.
        </p>
      </div>
    </StepWrapper>
  );
}