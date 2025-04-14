import React from "react";
import LogoIcon from "@/assets/icons/Logo Tecnitrama.svg"
interface LogoProps {
  text?: string;
  emoji?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ text = "ecnitrama", className }) => {
  return (
    <div className={`flex text-2xl font-bold place-items-center ${className}`}>
      <img src={LogoIcon} alt="Logo Icon" className="aspect-square" />
      <span>{text}</span>
    </div>
  );
};

export default Logo;
