import React from "react";

export interface CustomButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "button",
  onClick,
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`col-span-2 h-fit bg-rojo-intec-400 font-barlow text-black p-2 rounded-full border-2 border-black ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
