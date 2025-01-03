import React from 'react';
import { format } from 'date-fns';
import { getMonthDays, getWeekDays } from '../utils/calendar';

interface Activity {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
}

interface Activities {
  [key: string]: Activity[];
}

interface CalendarGridProps {
  currentMonth: number;
  onDayClick: (date: Date) => void;
  activities: Activities;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  currentMonth, 
  onDayClick,
  activities 
}) => {
  const days = getMonthDays(2025, currentMonth);
  const weekDays = getWeekDays();

  console.log('Rendering CalendarGrid with activities:', activities);

  return (
    <div className="grid grid-cols-7 gap-1">
      {weekDays.map(day => (
        <div 
          key={day} 
          className="text-center p-2 bg-gray-100 font-semibold"
        >
          {day}
        </div>
      ))}
      
      {days.map(day => {
        const dayOfWeek = day.getDay();
        const isFirstDay = format(day, 'd') === '1';
        const dateKey = day.toISOString().split('T')[0];
        const dayActivities = activities?.[dateKey]?.map(activity => ({
          ...activity,
          start_time: activity.start_time || '',
          end_time: activity.end_time || '',
        })) || [];

        console.log('Day:', dateKey, 'Activities:', dayActivities);

        return (
          <div
            key={day.toString()}
            style={isFirstDay ? { gridColumnStart: dayOfWeek + 1 } : undefined}
            className={`p-4 border text-center hover:bg-gray-50 cursor-pointer relative ${
              dayActivities.length > 0 ? 'bg-blue-50' : ''
            }`}
            onClick={() => onDayClick(day)}
          >
            {format(day, 'd')}
            {dayActivities.length > 0 && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
