import React from "react";

export interface InfoCardProps {
  title: string;
  content: string | string[] | React.ReactNode; // Add ReactNode type
  headerButton?: React.ReactNode;
  headerColor?: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  headerButton,
  headerColor,
  className = "",
}) => {
  return (
    <div className={`w-full rounded-[10px] outline outline-1 outline-[#63666A] flex flex-col overflow-hidden ${className}`}>
      <div className={`bg-rojo-intec-200 flex justify-between items-center p-2.5 ${headerColor}`}>
        <h3 className="text-black text-xl font-barlow font-medium leading-[26px]">
          {title}
        </h3>
        {headerButton}
      </div>
      <div className="h-0 border-t border-[#63666A]" />
      <div className="p-2.5 bg-rojo-intec-200 font-barlow">
        {typeof content === "string" ? (
          <p className="text-black text-base font-barlow font-normal leading-[26px]">
            {content}
          </p>
        ) : Array.isArray(content) ? (
          <div className="flex flex-wrap gap-2">
            {content.map((item, index) => (
              <div
                key={index}
                className="px-[15px] py-1 bg-white rounded-[22px] outline outline-1 outline-black flex items-center"
              >
                <span className="text-black text-xs font-barlow font-medium leading-5">
                  {item}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Render ReactNode directly
          <div className="w-full">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;