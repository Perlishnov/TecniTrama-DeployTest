import React, { useEffect, useState } from "react";
import CreatorLayout from "@/layouts/default";
import CustomTabs, { CustomTab } from "@/components/tabs";
import ProjectCard from "@/components/projectCard"
import Button from "@/components/button";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { Link } from "react-router-dom";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  filters: string[];
  completado: boolean;
}

interface CreatorProfile {
  name: string;
  email: string;
  career: string;
  bio: string;
  avatarUrl: string;
}

const CreatorProfilePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const decodedToken = useDecodeJWT();
  const userId = decodedToken?.id;

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const profileRes = await fetch(`http://localhost:3000/api/profiles/user/${userId}`, {
          headers,
        });

        const profileData = await profileRes.json();
        setProfile(profileData);

        const projectsRes = await fetch("http://localhost:3000/api/projects", {
          headers,
        });

        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, [userId]);

  if (!profile) {
    return (
      <CreatorLayout>
        <div className="w-full h-screen flex items-center justify-center">
          <p className="text-lg font-medium">Cargando perfil...</p>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="w-full flex flex-col items-center gap-14 px-4 py-6">
        {/* Perfil del Creador */}
        <div className="flex flex-col md:flex-row items-start gap-8 w-full max-w-6xl">
          <img
            className="w-40 h-44 object-fill rounded-full border border-gray-300"
            src={profile.avatarUrl}
            alt="Profile"
          />

          <div className="flex-1 flex flex-col gap-4">
            <div className="text-black text-2xl font-bold font-barlow">
              {profile.name}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <span className="text-black text-base font-medium font-barlow">
                {profile.email}
              </span>
              <span className="text-black text-base font-medium font-barlow">
                {profile.career}
              </span>
            </div>

            <div className="text-gray-600 text-base font-medium font-barlow max-w-xl">
              Biografía: {profile.bio}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <Button className="px-4 py-2">
              <Link to="/profile/edit-profile">Editar perfil</Link>
            </Button>
            <Button onClick={() => setShowModal(true)} className="px-4 py-2">
              Cambiar contraseña
            </Button>
            {showModal && (
              <ChangePasswordModal onClose={() => setShowModal(false)} />
            )}
          </div>
        </div>

        {/* Sección de proyectos */}
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-medium font-barlow text-center mb-6">
            Tus proyectos
          </h2>

          <CustomTabs>
            <CustomTab label="Publicados">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.filter(p => !p.completado).map(p => (
                  <ProjectCard key={p.id} {...p} />
                ))}
              </div>
            </CustomTab>

            <CustomTab label="Creados">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(p => (
                  <ProjectCard key={p.id} {...p} />
                ))}
              </div>
            </CustomTab>

            <CustomTab label="Cerrados">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.filter(p => p.completado).map(p => (
                  <ProjectCard key={p.id} {...p} />
                ))}
              </div>
            </CustomTab>
          </CustomTabs>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorProfilePage;
