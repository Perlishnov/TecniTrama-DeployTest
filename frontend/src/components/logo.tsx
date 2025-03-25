import React from "react";

interface LogoProps {
  text?: string;
  emoji?: string;
}

const Logo: React.FC<LogoProps> = ({ text = "Logo", emoji = "🍓" }) => {
  return (
    <div className="text-center text-4xl font-bold mb-4">
      <span role="img" aria-label="Logo">
        {emoji}
      </span>{" "}
      {text}
    </div>
  );
};

export default Logo;
