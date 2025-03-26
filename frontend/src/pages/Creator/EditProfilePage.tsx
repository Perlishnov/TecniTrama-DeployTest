import React, { useState } from 'react';
import CreatorLayout from '@/layouts/default';
import Button from '@/components/button';
import AvatarUrl from '@/assets/profile_page_avatar.svg';
import Input from '@/components/input';
import TextareaField from '@/components/TextareaField';

const EditProfilePage: React.FC = () => {
  // State hooks for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [career, setCareer] = useState('');
  const [biography, setBiography] = useState('');
  const [experience, setExperience] = useState('');

  // Handler for form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Perform update logic here
    console.log({
      firstName,
      lastName,
      phoneNumber,
      career,
      biography,
      experience,
    });
  };

  return (
    <CreatorLayout>
      <div className="w-full flex flex-col items-center gap-5">
        <h1 className="text-Base-Negro text-4xl font-medium font-barlow leading-7">
          Editar tu perfil
        </h1>
        <div className="px-6 py-8 bg-rojo-intec-100 rounded-[56px] flex flex-col items-center">
          <div className="flex items-center gap-5">
            <img
              className="w-24 h-20 rounded-full"
              src={AvatarUrl}
              alt="Profile"
            />
            <Button className="bg-rojo-intec-400 rounded-[45px] border border-black p-2.5">
              Cambiar foto
            </Button>
          </div>
          <form
            className="flex flex-col items-center gap-7"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <label
                  htmlFor="firstName"
                  className="text-base text-xs font-medium font-barlow leading-tight"
                >
                  Nombre
                </label>
                <Input
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center">
                <label
                  htmlFor="lastName"
                  className="text-Base-Negro text-xs font-medium font-barlow leading-tight"
                >
                  Apellido
                </label>
                <Input
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="phoneNumber"
                    className="text-Base-Negro text-xs font-medium font-barlow leading-tight"
                  >
                    Número de teléfono
                  </label>
                  <Input
                    name="phoneNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
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
            <Button
              type="submit"
              className='px-4 py-2'
            >
              Guardar cambios
            </Button>
          </form>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default EditProfilePage;
