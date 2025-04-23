import React from "react";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface CustomDatePickerProps {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  onClose: () => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onSelect,
  onClose,
  minDate,
  maxDate,
  disabled = false,
}) => {
  const parsedDate = selectedDate ? dayjs(selectedDate, "DD/MM/YYYY") : null;

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      onSelect(date.format("DD/MM/YYYY"));
      onClose();
    }
  };

  const disabledDate = (current: Dayjs) => {
    const today = dayjs().startOf('day');
    
    // Deshabilitar fechas anteriores a minDate
    if (minDate && current.isBefore(minDate, 'day')) return true;
    
    // Deshabilitar fechas posteriores a maxDate
    if (maxDate && current.isAfter(maxDate, 'day')) return true;
    
    // Por defecto, deshabilitar fechas anteriores a hoy
    if (!minDate && !maxDate) return current.isBefore(today, 'day');
    
    return false;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-[320px] max-w-[95vw]">
      <div className="flex justify-between items-center mb-4 relative">
        <h3 className="text-lg font-medium text-black">Seleccionar Fecha</h3>
        <button 
          onClick={onClose} 
          className="text-2xl text-gray-500 hover:text-gray-700 transition-colors focus:outline-none absolute right-0 top-0"
        >
          &times;
        </button>
      </div>
      
      <DatePicker
        value={parsedDate || undefined}
        onChange={handleDateChange}
        allowClear={false}
        open={true}
        format="DD/MM/YYYY"
        className="w-full"
        disabledDate={disabledDate}
        disabled={disabled}
      />
    </div>
  );
};

export default CustomDatePicker;