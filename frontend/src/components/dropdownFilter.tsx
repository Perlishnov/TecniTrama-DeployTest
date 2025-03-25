import React from "react";

export interface DropdownFilterProps {
  label: string;
  onUpdate: (value: string) => void;
  className?: string;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  onUpdate,
  className = "",
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`w-28 h-10 px-3.5 py-1 bg-white rounded-[71px] outline outline-2 outline-offset-[-2px] outline-black inline-flex justify-center items-center gap-1 cursor-pointer ${className}`}
      onClick={() => onUpdate(label)}
      onKeyDown={(e) => e.key === "Enter" && onUpdate(label)}
    >
      <div className="text-justify text-black text-xl font-medium font-['Barlow'] leading-relaxed">
        {label}
      </div>
      <div className="w-5 h-5 relative overflow-hidden">
        <div className="w-2.5 h-[5.01px] absolute left-[5.01px] top-[7.51px] outline outline-[1.25px] outline-offset-[-0.62px] outline-Text-primary" />
      </div>
    </div>
  );
};

export default DropdownFilter;
