'use client';

import { useApplicationStore } from '../../store/useApplicationStore';
import StepWrapper from '../../components/StepWrapper';
import { CheckCircle, PencilLine, User, GraduationCap, Briefcase, Paperclip, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function ReviewStep() {
  const { formData, setCurrentStep } = useApplicationStore();

  const about = formData.about || {};
  const education = formData.education || {};
  const internship = formData.internship || {};
  const uploads = formData.uploads || {};

  const handleFinalSubmit = () => {
    console.log('Final Application Data:', formData);
    alert('Application submitted successfully!');
  };

  const sections = [
    {
      step: 1,
      icon: <User className="w-4 h-4" />,
      title: 'Personal Information',
      color: 'blue',
      fields: [
        { label: 'First Name', value: about.firstName },
        { label: 'Last Name', value: about.lastName },
        { label: 'Nationality', value: about.nationality },
        { label: 'Phone', value: about.phone },
        { label: 'Date of Birth', value: about.dateOfBirth },
        { label: 'Language', value: about.language },
        { label: 'Gender', value: about.gender },
      ],
    },
    {
      step: 2,
      icon: <GraduationCap className="w-4 h-4" />,
      title: 'Education Background',
      color: 'violet',
      fields: [
        { label: 'School', value: education.schoolName },
        { label: 'Location', value: education.schoolLocation },
        { label: 'Field of Study', value: education.fieldOfStudy },
        { label: 'Level', value: education.level },
        { label: 'Program', value: education.program },
        { label: 'Previous Internship', value: education.previousInternship },
      ],
    },
    {
      step: 3,
      icon: <Briefcase className="w-4 h-4" />,
      title: 'Internship Details',
      color: 'emerald',
      fields: [
        { label: 'Specialty', value: internship.specialty },
        { label: 'Experience Level', value: internship.experienceLevel },
        { label: 'Duration', value: internship.duration },
        { label: 'Availability', value: internship.availability },
        { label: 'Work Experience', value: internship.workExperience },
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
    blue:    { pill: 'bg-blue-50 text-blue-600 border-blue-100',        icon: 'bg-blue-100 text-blue-600',        editBtn: 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'         },
    violet:  { pill: 'bg-violet-50 text-violet-600 border-violet-100',  icon: 'bg-violet-100 text-violet-600',    editBtn: 'text-violet-500 hover:text-violet-700 hover:bg-violet-50'   },
    emerald: { pill: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'bg-emerald-100 text-emerald-600', editBtn: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50' },
    amber:   { pill: 'bg-amber-50 text-amber-600 border-amber-100',     icon: 'bg-amber-100 text-amber-600',      editBtn: 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'       },
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
          <p className="text-xs text-green-600 mt-0.5">All sections have been filled. Please confirm before submitting.</p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const c = colorMap[section.color];
          return (
            <div
              key={section.step}
              className="group border border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-200 hover:shadow-sm transition-all duration-200"
            >
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

                    {/* Passport photo + doc checklist side by side */}
                    <div className="flex gap-6 items-start">

                      {/* ── Passport photo ── */}
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                          Passport Photo
                        </span>
                        {uploads.passportPhotoUrl ? (
                          <div className="relative">
                            <img
                              src={uploads.passportPhotoUrl}
                              alt={`${about.firstName ?? 'Applicant'}'s passport photo`}
                              width={96}
                              height={112}
                              className="w-24 h-28 object-cover rounded-xl border-2 border-green-200 shadow-sm"
                            />
                            {/* green tick badge */}
                            <span className="absolute -bottom-1.5 -right-1.5 bg-green-500 rounded-full p-0.5 shadow">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </span>
                          </div>
                        ) : (
                          <div className="w-24 h-28 rounded-xl border-2 border-dashed border-red-200 bg-red-50 flex flex-col items-center justify-center gap-1.5">
                            <User className="w-6 h-6 text-red-300" />
                            <span className="text-[10px] text-red-400 font-medium text-center leading-tight px-1">
                              Not uploaded
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ── Doc checklist ── */}
                      <div className="flex-1 space-y-3 pt-6">
                        {docItems.map((doc) => (
                          <div key={doc.label} className="flex items-center gap-2.5">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${
                              doc.value ? 'bg-green-500' : doc.required ? 'bg-red-400' : 'bg-zinc-300'
                            }`} />
                            <span className="text-sm text-zinc-700 flex-1">{doc.label}</span>
                            <span className={`text-xs font-medium ${
                              doc.value ? 'text-green-600' : doc.required ? 'text-red-500' : 'text-zinc-400'
                            }`}>
                              {doc.value ? 'Uploaded' : doc.required ? 'Missing' : 'Optional'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social links */}
                    {linkItems.length > 0 && (
                      <div className="pt-3 border-t border-zinc-100 space-y-2">
                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                          Social Links
                        </span>
                        {linkItems.map((link) => (
                          <div key={link.label} className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500 w-16">{link.label}</span>
                            <a
                              href={link.value}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-500 hover:underline truncate max-w-[220px]"
                            >
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
  );
}