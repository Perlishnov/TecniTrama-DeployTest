import { useState } from "react";

interface UseCloudinaryUploadProps {
  uploadPreset: string;
  cloudName: string;
}

export const useCloudinaryUpload = ({
  uploadPreset,
  cloudName,
}: UseCloudinaryUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, imageUrl, uploadFile };
};
