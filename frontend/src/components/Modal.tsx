import React from "react";

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, className }) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 `}>
      <div className={`rounded-lg shadow-xl w-full max-w-lg p-4 ${className}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-medium font-bold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-3xl focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
