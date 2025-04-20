import React from "react";

export interface InputFieldProps {
  name: string,
  type?: string;
  placeholder?: string;
  pattern?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  // Función de validación opcional que devuelve un booleano
  validationFunction?: (value: string) => boolean;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name = "",
  type = "text",
  placeholder = "",
  pattern,
  value,
  onChange,
  className = "",
  validationFunction,
  disabled
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationFunction) {
      const isValid = validationFunction(e.target.value);
      if (!isValid) {
        // Puedes implementar una lógica adicional en caso de error
        console.warn("Valor no válido");
      }
    }
    onChange && onChange(e);
  };

  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      pattern={pattern}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`px-4 py-2 bg-white border-2 border-black rounded-xl ${className}`}
    />
  );
};

export default InputField;
