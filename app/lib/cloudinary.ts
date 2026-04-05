export async function uploadToCloudinary(
  file: File,
  applicationId: string | undefined,
  fileType: 'cv' | 'application-letter' | 'passport' | 'support-letter' | 'pdf-summary'
): Promise<string> {
  // Safe fallback and cleaning
  let cleanAppId = 'unknown-applicant';

  if (applicationId && typeof applicationId === 'string') {
    cleanAppId = applicationId
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const folder = `teratechcompany-internship/applications/${cleanAppId}/${fileType}`;
  formData.append('folder', folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary environment variables are missing');
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Cloudinary Error:', errorData);
    throw new Error(errorData.error?.message || errorData.message || 'Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}