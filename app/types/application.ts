export interface AboutData {
  firstName: string;
  lastName: string;
  nationality: string;
  phone: string;
  dateOfBirth: string;
  language: 'English' | 'French';
  gender: 'Male' | 'Female';
  email: string;
}

export interface EducationData {
  schoolName: string;
  schoolLocation: string;
  fieldOfStudy: string;
  level: string; // Year 1-4
  program: 'HND' | 'Degree' | 'Masters';
  previousInternship?: string;
}

export interface InternshipData {
  specialty: string;
  experienceLevel: string;
  duration: string;
  availability: string;
  workExperience: string;
}

export interface UploadsData {
  cvUrl: string;
  applicationLetterUrl: string;
  passportPhotoUrl: string;
  supportLetterUrl?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface ApplicationFormData {
  about: AboutData;
  education: EducationData;
  internship: InternshipData;
  uploads: UploadsData;
  applicationId?: string;
}

export type StepProps = {
  onNext: () => void;
  onPrev: () => void;
};