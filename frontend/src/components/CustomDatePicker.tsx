// CustomDatePicker.tsx
import React from "react";
import { useLocale } from "@react-aria/i18n";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onSelect: (date: string) => void;
  onClose: () => void;
}


const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onSelect,
  onClose,
}) => {
  const { locale } = useLocale();
  const defaultDate = selectedDate ? new Date(selectedDate) : new Date();

  const handleDateClick = (date: Date) => {
    onSelect(date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }));
    onClose();
  };

  const sampleDates = Array.from({ length: 31 }, (_, i) => 
    new Date(defaultDate.getFullYear(), defaultDate.getMonth(), i + 1)
  ).filter(date => date.getMonth() === defaultDate.getMonth());

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-[320px] max-w-[95vw]"> {/* Fixed width */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-black">Seleccionar Fecha</h3>
        <button 
          onClick={onClose} 
          className="text-2xl text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        >
          &times;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-1">
            {day}
          </div>
        ))}
        
        {/* Calendar dates */}
        {sampleDates.map((date, index) => (
          <button
            key={index}
            className={`w-10 h-10 p-1 rounded-full text-sm flex items-center justify-center
              hover:bg-rojo-intec-400 transition-colors
              ${date.toDateString() === new Date().toDateString() 
                ? 'bg-rojo-intec-400 text-white hover:bg-rojo-intec-200' 
                : 'text-gray-700'}
              ${date.getDay() === 0 || date.getDay() === 6 
                ? 'text-red-500' 
                : ''}`}
            onClick={() => handleDateClick(date)}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomDatePicker;