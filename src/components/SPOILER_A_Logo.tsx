import React from "react";

interface SPOILER_A_LogoProps {
  className?: string;
  size?: number;
}

export const SPOILER_A_Logo: React.FC<SPOILER_A_LogoProps> = ({
  className = "",
  size = 40,
}) => {
  return (
    <img
      src="/input_file_0.png"
      alt="Daliaxez Logo"
      style={{ width: size, height: size }}
      className={`object-contain select-none transition-transform duration-300 hover:scale-105 ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};
