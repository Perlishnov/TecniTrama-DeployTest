import React from "react";

export interface ProfileWidgetProps {
  avatarUrl?: string;
  name: string;
  email: string;
  className?: string;
}

const ProfileWidget: React.FC<ProfileWidgetProps> = ({
  avatarUrl,
  name,
  email,
  className = "",
}) => {
  return (
    <div className={`self-stretch h-24 px-4 py-6 bg-rose-200 inline-flex flex-col justify-between items-start ${className}`}>
      <div className="inline-flex justify-start items-center gap-4">
        <div data-state="online" className="w-10 h-10 rounded-full overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-400" />
          )}
        </div>
        <div className="inline-flex flex-col justify-start items-start">
          <div className="text-black text-base font-semibold font-['Barlow'] leading-tight">
            {name}
          </div>
          <div className="text-black text-xs font-medium font-['Barlow'] leading-tight">
            {email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
