'use client';

import { useState } from 'react';
import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { generateApplicationPDF } from '../../lib/generateApplicationPDF';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { supabase } from '../../lib/supabase';
import {
  CheckCircle, PencilLine, User, GraduationCap,
  Briefcase, Paperclip, AlertTriangle, Mail, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { sendConfirmationEmail } from '../../lib/sendConfirmationEmail';

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation: 'modalIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both' }}>
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.92) translateY(16px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
          }
          @keyframes confetti {
            0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
            100% { transform: translateY(60px) rotate(720deg); opacity: 0; }
          }
          .confetti-dot { animation: confetti 1.2s ease-in forwards; }
        `}</style>

        {/* Gradient top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

        <div className="px-8 pt-8 pb-7 text-center">
          {/* Animated icon */}
          <div className="relative inline-flex mb-5 justify-center">
            {/* Confetti dots */}
            {[
              { top: '-8px', left: '4px',  color: '#3b82f6', delay: '0s'   },
              { top: '-12px',left: '50%',  color: '#8b5cf6', delay: '0.1s' },
              { top: '-6px', right: '4px', color: '#10b981', delay: '0.05s'},
              { top: '10px', left: '-8px', color: '#f59e0b', delay: '0.15s'},
              { top: '10px', right:'-8px', color: '#ef4444', delay: '0.08s'},
            ].map((d, i) => (
              <span
                key={i}
                className="confetti-dot absolute w-2 h-2 rounded-full"
                style={{ ...d, backgroundColor: d.color, animationDelay: d.delay }}
              />
            ))}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center border-4 border-green-100">
              <CheckCircle className="w-9 h-9 text-green-500" />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-zinc-900 mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>
            You&apos;re all done{name ? `, ${name}` : ''}! 🎉
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Your application has been successfully submitted to the Tera-Tech Ltd internship team.
          </p>

          {/* Email confirmation card */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 text-left mt-5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-800 mb-1">Check your inbox</p>
              <p className="text-xs text-blue-600 leading-relaxed">
                A confirmation email is on its way. If you don&apos;t receive it within{' '}
                <strong>24 hours</strong>, please{' '}
                <Link
                  href="/#contact"
                  onClick={onClose}
                  className="font-semibold underline underline-offset-2 hover:text-blue-800 transition"
                >
                  contact us
                </Link>{' '}
                and we&apos;ll sort it out.
              </p>
            </div>
          </div>

          {/* What's next list */}
          <div className="text-left mb-6 space-y-2">
            {[
              { step: '1', text: 'Check your email for confirmation' },
              { step: '2', text: 'Our team reviews within 5 business days' },
              { step: '3', text: 'You\'ll be contacted for a short interview' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <span className="text-xs text-zinc-600">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md"
          >
            Join Our Community
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-zinc-400 mt-3">
            You&apos;ll be redirected to our community hub
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ReviewStep ───────────────────────────────────────────────────────────────

export default function ReviewStep() {
  const { formData, setCurrentStep, resetForm } = useApplicationStore();
  const [showModal, setShowModal] = useState(false);

  const about      = formData.about      || {};
  const education  = formData.education  || {};
  const internship = formData.internship || {};
  const uploads    = formData.uploads    || {};

  const handleFinalSubmit = async () => {
    try {
      // 1. Generate PDF
      const pdfBlob = await generateApplicationPDF(formData);

      // 2. Upload PDF (same folder)
      const applicationId = (formData as any)?.applicationId || 
                           `teratechcompany-internship_${(formData.about?.firstName || 'applicant').toLowerCase()}_${Date.now()}`;

      const pdfFile = new File([pdfBlob], `${applicationId}-application-summary.pdf`, { 
        type: 'application/pdf' 
      });

      const pdfUrl = await uploadToCloudinary(pdfFile, applicationId, 'pdf-summary');

      // 3. Save to Supabase
      const { error: dbError } = await supabase.from('applications').insert({
        application_id: applicationId,
        email: formData.about?.email,
        about: formData.about,
        education: formData.education,
        internship: formData.internship,
        uploads: formData.uploads,
        pdf_url: pdfUrl,
        full_name: `${formData.about?.firstName || ''} ${formData.about?.lastName || ''}`.trim(),
        status: 'pending',
      });

      if (dbError) throw dbError;

      // 4. Send confirmation email
      if (formData.about?.email) {
        await sendConfirmationEmail(
          formData.about.email,
          formData.about.firstName
        );
      }

      console.log('✅ Full submission completed successfully!');
      setShowModal(true);

    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Submission failed: ${error.message || 'Please try again'}`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
    // Redirect home → community section
    window.location.href = '/#community';
  };

  const sections = [
    {
      step: 1,
      icon: <User className="w-4 h-4" />,
      title: 'Personal Information',
      color: 'blue',
      fields: [
        { label: 'First Name',    value: about.firstName    },
        { label: 'Last Name',     value: about.lastName     },
        { label: 'Nationality',   value: about.nationality  },
        { label: 'Phone',         value: about.phone        },
        { label: 'Date of Birth', value: about.dateOfBirth  },
        { label: 'Language',      value: about.language     },
        { label: 'Gender',        value: about.gender       },
      ],
    },
    {
      step: 2,
      icon: <GraduationCap className="w-4 h-4" />,
      title: 'Education Background',
      color: 'violet',
      fields: [
        { label: 'School',               value: education.schoolName         },
        { label: 'Location',             value: education.schoolLocation     },
        { label: 'Field of Study',       value: education.fieldOfStudy       },
        { label: 'Level',                value: education.level              },
        { label: 'Program',              value: education.program            },
        { label: 'Previous Internship',  value: education.previousInternship },
      ],
    },
    {
      step: 3,
      icon: <Briefcase className="w-4 h-4" />,
      title: 'Internship Details',
      color: 'emerald',
      fields: [
        { label: 'Specialty',        value: internship.specialty       },
        { label: 'Experience Level', value: internship.experienceLevel },
        { label: 'Duration',         value: internship.duration        },
        { label: 'Availability',     value: internship.availability    },
        { label: 'Work Experience',  value: internship.workExperience  },
      ],
    },
    {
      step: 4,
      icon: <Paperclip className="w-4 h-4" />,
      title: 'Documents & Links',
      color: 'amber',
      isDocuments: true,
    },
  ];

  const colorMap: Record<string, { pill: string; icon: string; editBtn: string }> = {
    blue:    { pill: 'bg-blue-50 text-blue-600 border-blue-100',          icon: 'bg-blue-100 text-blue-600',        editBtn: 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'          },
    violet:  { pill: 'bg-violet-50 text-violet-600 border-violet-100',    icon: 'bg-violet-100 text-violet-600',    editBtn: 'text-violet-500 hover:text-violet-700 hover:bg-violet-50'    },
    emerald: { pill: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'bg-emerald-100 text-emerald-600',  editBtn: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50' },
    amber:   { pill: 'bg-amber-50 text-amber-600 border-amber-100',       icon: 'bg-amber-100 text-amber-600',      editBtn: 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'       },
  };

  const docItems = [
    { label: 'CV / Resume',        value: uploads.cvUrl,                required: true  },
    { label: 'Application Letter', value: uploads.applicationLetterUrl, required: true  },
    { label: 'Support Letter',     value: uploads.supportLetterUrl,     required: false },
  ];

  const linkItems = [
    { label: 'LinkedIn',  value: uploads.socialLinks?.linkedin  },
    { label: 'GitHub',    value: uploads.socialLinks?.github    },
    { label: 'Portfolio', value: uploads.socialLinks?.portfolio },
  ].filter(l => l.value);

  return (
    <>
      {showModal && <SuccessModal name={about.firstName} onClose={handleModalClose} />}

      <StepWrapper
        title="Review Application"
        description="Check everything carefully before submitting."
        onNext={handleFinalSubmit}
      >
        {/* Completion Banner */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-5 py-4 mb-8">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Application ready for review</p>
            <p className="text-xs text-green-600 mt-0.5">All sections filled. Please confirm before submitting.</p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => {
            const c = colorMap[section.color];
            return (
              <div key={section.step} className="group border border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-200 hover:shadow-sm transition-all duration-200">
                {/* Section Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-zinc-50/60 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.icon}`}>
                      {section.icon}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-zinc-800">{section.title}</span>
                      <span className={`ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full border ${c.pill}`}>
                        Step {section.step}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(section.step)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${c.editBtn}`}
                  >
                    <PencilLine className="w-3 h-3" />
                    Edit
                  </button>
                </div>

                {/* Section Body */}
                <div className="px-5 py-4">
                  {!section.isDocuments ? (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {section.fields!.filter(f => f.value).map((field) => (
                        <div key={field.label} className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">{field.label}</span>
                          <span className="text-sm text-zinc-800 font-medium">{field.value}</span>
                        </div>
                      ))}
                      {section.fields!.filter(f => f.value).length === 0 && (
                        <p className="text-sm text-zinc-400 col-span-2 italic">No information provided yet.</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-6 items-start">
                        {/* Passport photo */}
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Passport Photo</span>
                          {uploads.passportPhotoUrl ? (
                            <div className="relative">
                              <img
                                src={uploads.passportPhotoUrl}
                                alt={`${about.firstName ?? 'Applicant'}'s passport photo`}
                                className="w-24 h-28 object-cover rounded-xl border-2 border-green-200 shadow-sm"
                              />
                              <span className="absolute -bottom-1.5 -right-1.5 bg-green-500 rounded-full p-0.5 shadow">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </span>
                            </div>
                          ) : (
                            <div className="w-24 h-28 rounded-xl border-2 border-dashed border-red-200 bg-red-50 flex flex-col items-center justify-center gap-1.5">
                              <User className="w-6 h-6 text-red-300" />
                              <span className="text-[10px] text-red-400 font-medium text-center leading-tight px-1">Not uploaded</span>
                            </div>
                          )}
                        </div>

                        {/* Doc checklist */}
                        <div className="flex-1 space-y-3 pt-6">
                          {docItems.map((doc) => (
                            <div key={doc.label} className="flex items-center gap-2.5">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${doc.value ? 'bg-green-500' : doc.required ? 'bg-red-400' : 'bg-zinc-300'}`} />
                              <span className="text-sm text-zinc-700 flex-1">{doc.label}</span>
                              <span className={`text-xs font-medium ${doc.value ? 'text-green-600' : doc.required ? 'text-red-500' : 'text-zinc-400'}`}>
                                {doc.value ? 'Uploaded' : doc.required ? 'Missing' : 'Optional'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {linkItems.length > 0 && (
                        <div className="pt-3 border-t border-zinc-100 space-y-2">
                          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Social Links</span>
                          {linkItems.map((link) => (
                            <div key={link.label} className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 w-16">{link.label}</span>
                              <a href={link.value} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[220px]">
                                {link.value}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            By clicking <strong>Submit Application</strong>, you confirm that all information provided is accurate and complete.
            Submitting false information may result in disqualification.
          </p>
        </div>
      </StepWrapper>
    </>
  );
}