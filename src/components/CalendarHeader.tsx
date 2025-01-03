import React from 'react';
import { getMonthName } from '../utils/calendar';

interface CalendarHeaderProps {
  currentMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <button 
        onClick={onPrevMonth}
        className="p-2 hover:bg-gray-100 rounded"
      >
        ←
      </button>
      <h2 className="text-xl font-bold">
        {getMonthName(currentMonth)} 2025
      </h2>
      <button 
        onClick={onNextMonth}
        className="p-2 hover:bg-gray-100 rounded"
      >
        →
      </button>
    </div>
  );
};