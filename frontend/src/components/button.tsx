import React from "react";

export interface CustomButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "button",
  onClick,
  children,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`col-span-2 bg-red-500 text-black py-2 rounded-full border-2 border-black ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
