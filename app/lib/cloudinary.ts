export async function uploadToCloudinary(
  file: File, 
  applicationId: string, 
  fileType: 'cv' | 'application-letter' | 'passport' | 'support-letter'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
  // Dynamic folder per application
  const folder = `sika-internships/applications/${applicationId}/${fileType}`;
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
    throw new Error(errorData.message || 'Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}