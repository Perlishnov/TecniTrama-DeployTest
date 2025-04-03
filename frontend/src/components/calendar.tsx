import React from "react";
import { Calendar } from "@heroui/calendar";
import { CalendarDate, parseDate } from "@internationalized/date";

interface CustomCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  isOpen,
  onClose,
  onDateSelect,
  selectedDate,
}) => {
  if (!isOpen) return null;

  // Convert JS Date to CalendarDate
  const toCalendarDate = (date?: Date): CalendarDate | undefined => {
    if (!date) return undefined;
    return parseDate(date.toISOString().split('T')[0]);
  };

  // Convert CalendarDate to JS Date
  const toJsDate = (date: CalendarDate): Date => {
    return new Date(date.year, date.month - 1, date.day);
  };

  return (
    <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <Calendar
        value={toCalendarDate(selectedDate)}
        onChange={(value: CalendarDate) => {
          onDateSelect(toJsDate(value));
          onClose();
        }}
        className="font-barlow bg-white rounded-lg"
      />
    </div>
  );
};

export default CustomCalendar;