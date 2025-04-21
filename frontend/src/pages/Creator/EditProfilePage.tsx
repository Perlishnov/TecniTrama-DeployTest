import React, { useState, useRef, useEffect } from "react";
import CreatorLayout from "@/layouts/default";
import Button from "@/components/button";
import Input from "@/components/input";
import TextareaField from "@/components/TextareaField";
import AvatarUrl from "@/assets/profile_page_avatar.svg";
import { notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useCloudinaryUpload } from "@/hooks/usecloudinary";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import { useNavigate } from "react-router-dom";

interface Profile {
  profile_id: number;
  experience: string | null;
  carreer: string | null;
  bio: string | null;
  profile_image: string | null;
}

const EditProfilePage: React.FC = () => {
  const [career, setCareer] = useState("");
  const [biography, setBiography] = useState("");
  const [experience, setExperience] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>(AvatarUrl);
  const apiRoute = import.meta.env.VITE_API_ROUTE;
  const navigate = useNavigate();

  const { isUploading, uploadFile, error: uploadError } = useCloudinaryUpload({
    uploadPreset: "tecnitrama-asset",
    cloudName: "dcrl5demd",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token") || "";
  const decoded = useDecodeJWT();
  const userId = decoded?.id;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!token || !userId) return;
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${apiRoute}profiles/user/${userId}`, {
          method: "GET",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profiles");
        const data: Profile = await res.json();
        setProfile(data);
        setCareer(data.carreer || "");
        setBiography(data.bio || "");
        setExperience(data.experience || "");
        setProfilePhoto(data.profile_image || AvatarUrl);
      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token, userId]);

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadFile(file);
      if (url) {
        setProfilePhoto(url);
      }
    }
  };

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
      const res = await fetch(`${apiRoute}profiles/${profile.profile_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update profile");
      }
      notification.open({
        message: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente.",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        placement: "topRight",
        duration: 3,
      });
    } catch (err: any) {
      setApiError(err.message);
      notification.open({
        message: "Error al actualizar",
        description: err.message || "Hubo un problema al actualizar tu perfil.",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />, 
        placement: "topRight",
        duration: 4,
      });
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
            <img className="w-24 h-20 rounded-full" src={profilePhoto} alt="Profile" />
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

          <form className="flex flex-col items-center gap-7" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-96">
              <label htmlFor="career" className="text-Base-Negro text-xs font-medium font-barlow leading-tight">
                Carrera
              </label>
              <Input
                name="career"
                type="text"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center w-96">
              <label htmlFor="biography" className="text-Base-Negro text-xs font-medium font-barlow leading-tight">
                Biografía
              </label>
              <TextareaField
                name="biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center w-96">
              <label htmlFor="experience" className="text-Base-Negro text-xs font-medium font-barlow leading-tight">
                Experiencia
              </label>
              <TextareaField
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <Button type="submit" className="px-4 py-2">
                Guardar cambios
              </Button>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400"
              >
                Volver
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default EditProfilePage;