import { z } from 'zod';

export const AboutSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  nationality: z.string().min(2, 'Nationality is required'),
  phone: z.string().min(9, 'Valid phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  language: z.enum(['English', 'French']),
  gender: z.enum(['Male', 'Female']),
});

export type AboutFormData = z.infer<typeof AboutSchema>;


export const EducationSchema = z.object({
  schoolName: z.string().min(3, 'School name is required'),
  schoolLocation: z.string().min(3, 'School location is required'),
  fieldOfStudy: z.string().min(3, 'Field of study is required'),
  level: z.string().min(1, 'Level is required'),
  program: z.enum(['HND', 'Degree', 'Masters']),
  previousInternship: z.string().optional(),
});

export type EducationFormData = z.infer<typeof EducationSchema>;


export const InternshipSchema = z.object({
  specialty: z.string().min(1, 'Please select a specialty'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  duration: z.string().min(1, 'Duration is required'),
  availability: z.string().min(1, 'Availability is required'),
  workExperience: z.string().min(10, 'Please describe your relevant work experience'),
});

export type InternshipFormData = z.infer<typeof InternshipSchema>;


export const UploadsSchema = z.object({
  cvUrl: z.string().min(1, 'CV is required'),
  applicationLetterUrl: z.string().min(1, 'Application letter is required'),
  passportPhotoUrl: z.string().min(1, 'Passport photo is required'),
  supportLetterUrl: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  }),
});

export type UploadsFormData = z.infer<typeof UploadsSchema>;