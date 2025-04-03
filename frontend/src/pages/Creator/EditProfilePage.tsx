import React, { useState, useRef, useEffect } from "react";
import CreatorLayout from "@/layouts/default";
import Button from "@/components/button";
import Input from "@/components/input";
import TextareaField from "@/components/TextareaField";
import AvatarUrl from "@/assets/profile_page_avatar.svg";
import { useCloudinaryUpload } from "@/hooks/usecloudinary";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";

interface Profile {
  profile_id: number;
  experience: string | null;
  carreer: string | null;
  bio: string | null;
  profile_image: string | null;
}

const EditProfilePage: React.FC = () => {
  // Local state for profile fields (mapped to API fields)
  const [career, setCareer] = useState("");
  const [biography, setBiography] = useState("");
  const [experience, setExperience] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>(AvatarUrl);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // Cloudinary upload hook instance
  const { isUploading, uploadFile, error: uploadError } = useCloudinaryUpload({
    uploadPreset: "tecnitrama-asset",
    cloudName: "dcrl5demd",
  });

  // Reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for loading and API errors
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Retrieve userId and token from localStorage
  const token = localStorage.getItem("token") || "";
  const decoded = useDecodeJWT();
  const userId = decoded?.id;  

  // Local state for the entire profile
  const [profile, setProfile] = useState<Profile | null>(null);

  // Fetch current user's profile on mount
  useEffect(() => {
    if (!token || !userId) return;
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/api/profiles", {
          method: "GET",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data: Profile[] = await res.json();
        // Find profile by matching profile_id with userId (assuming they match)
        const currentProfile = data.find(
          (p) => p.profile_id.toString() === userId
        );
        if (currentProfile) {
          setProfile(currentProfile);
          // Set local fields from the fetched profile
          setCareer(currentProfile.carreer || "");
          setBiography(currentProfile.bio || "");
          setExperience(currentProfile.experience || "");
          setProfilePhoto(currentProfile.profile_image || AvatarUrl);
        } else {
          setApiError("Profile not found for current user");
        }
      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token, userId]);

  // Trigger file selection dialog for photo change
  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload to Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadFile(file);
      if (url) {
        setProfilePhoto(url);
      }
    }
  };

  // Handler for form submission (update profile via PUT)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return;
    try {
      setIsLoading(true);
      const updatedProfile = {
        experience,
        carreer: career,
        bio: biography,
        profile_image: profilePhoto,
      };
      const res = await fetch(
        `http://localhost:3000/api/profiles/${profile.profile_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProfile),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update profile");
      }
      alert("Profile updated successfully");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreatorLayout>
      <div className="w-full flex flex-col items-center gap-5">
        <h1 className="text-Base-Negro text-4xl font-medium font-barlow leading-7">
          Editar tu perfil
        </h1>
        {isLoading && <p>Cargando...</p>}
        {apiError && <p className="text-red-500">{apiError}</p>}
        <div className="px-6 py-8 bg-rojo-intec-100 rounded-[56px] flex flex-col items-center">
          <div className="flex items-center gap-5">
            <img
              className="w-24 h-20 rounded-full"
              src={profilePhoto}
              alt="Profile"
            />
            <Button
              onClick={handleChangePhotoClick}
              className="bg-rojo-intec-400 rounded-[45px] border border-black p-2.5"
            >
              Cambiar foto
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {isUploading && (
            <p className="text-sm text-gray-600">Subiendo imagen...</p>
          )}
          {uploadError && (
            <p className="text-sm text-red-500">{uploadError}</p>
          )}
          <form
            className="flex flex-col items-center gap-7"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-4">
              {/* First Name and Last Name are not used in this API update. */}
              {/* You might manage those separately if needed. */}
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <label
                  htmlFor="career"
                  className="text-Base-Negro text-xs font-medium font-barlow leading-tight"
                >
                  Carrera
                </label>
                <Input
                  name="career"
                  type="text"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="phoneNumber"
                  className="text-Base-Negro text-xs font-medium font-barlow leading-tight"
                >
                  {/* Phone number not updated in profile API */}
                  Número de teléfono
                </label>
                <Input
                  name="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={()=>true}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor="biography"
                className="text-Base-Negro text-xs font-medium font-barlow leading-tight"
              >
                Biografía
              </label>
              <TextareaField
                name="biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center">
              <label
                htmlFor="experience"
                className="text-Base-Negro text-xs font-medium font-barlow leading-tight"
              >
                Experiencia
              </label>
              <TextareaField
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <Button type="submit" className="px-4 py-2">
              Guardar cambios
            </Button>
          </form>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default EditProfilePage;
