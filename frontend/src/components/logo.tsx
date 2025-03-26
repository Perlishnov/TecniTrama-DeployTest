import React from "react";
import LogoIcon from "@/assets/icons/Logo Tecnitrama.svg"
interface LogoProps {
  text?: string;
  emoji?: string;
}

const Logo: React.FC<LogoProps> = ({ text = "ecnitrama" }) => {
  return (
    <div className="flex text-2xl font-bold place-items-center">
      <img src={LogoIcon} alt="Logo Icon" className="" />
      <span>{text}</span>
    </div>
  );
};

export default Logo;
