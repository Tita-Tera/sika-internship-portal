'use client';

import { useState } from 'react';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { generateApplicationPDF } from '../../lib/generateApplicationPDF';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { sendConfirmationEmail } from '../../lib/sendConfirmationEmail';
import { CheckCircle, User, GraduationCap, Briefcase, Paperclip, AlertTriangle, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessModal({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
        <p className="text-zinc-600 mb-6">Thank you, {name || 'Applicant'}!</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-semibold"
        >
          Go to Community
        </button>
      </div>
    </div>
  );
}

export default function ReviewStep() {
  const { formData, resetForm } = useApplicationStore();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const about = formData.about || {};
  const education = formData.education || {};
  const internship = formData.internship || {};
  const uploads = formData.uploads || {};

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log("Starting submission...");

      // 1. Generate PDF
      const pdfBlob = await generateApplicationPDF(formData as any);
      console.log("✅ PDF generated");

      // 2. Upload PDF
      const applicationId = formData.applicationId || `sika_${Date.now()}`;
      const pdfFile = new File([pdfBlob], `${applicationId}-summary.pdf`, { type: 'application/pdf' });

      const pdfUrl = await uploadToCloudinary(pdfFile, applicationId, 'pdf-summary');
      console.log("✅ PDF uploaded:", pdfUrl);

      // 3. Skip Supabase temporarily
      console.log("⚠️ Skipped Supabase due to DNS issue");

      // 4. Send confirmation email
      if (about.email) {
        await sendConfirmationEmail(about.email, about.firstName || 'Applicant');
        console.log("✅ Confirmation email sent");
      }

      setShowModal(true);

    } catch (error: any) {
      console.error("Submission error:", error);
      alert(`Submission failed: ${error?.message || 'Please check your connection and try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
    window.location.href = '/#community';
  };

  return (
    <>
      {showModal && <SuccessModal name={about.firstName} onClose={handleModalClose} />}

      <StepWrapper
        title="Review Your Application"
        description="Please review all information before submitting."
        onNext={handleFinalSubmit}
      >
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="border border-zinc-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
              {Object.entries(about).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="font-medium">{String(value || '—')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="border border-zinc-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Education Background</h3>
            </div>
            <div className="space-y-3 text-sm">
              {Object.entries(education).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium">{String(value || '—')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Internship */}
          <div className="border border-zinc-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold">Internship Preferences</h3>
            </div>
            <div className="space-y-3 text-sm">
              {Object.entries(internship).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium">{String(value || '—')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold rounded-2xl transition"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </StepWrapper>
    </>
  );
}