import React from "react";

export interface TextareaFieldProps {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  validationFunction?: (value: string) => boolean;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  name,
  placeholder = "",
  value,
  onChange,
  className = "",
  rows = 4,
  validationFunction,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (validationFunction) {
      const isValid = validationFunction(e.target.value);
      if (!isValid) {
        console.warn("Valor no válido");
      }
    }
    onChange && onChange(e);
  };

  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      rows={rows}
      className={`w-max px-4 py-2 bg-white border-2 border-black rounded-xl ${className}`}
    />
  );
};

export default TextareaField;
