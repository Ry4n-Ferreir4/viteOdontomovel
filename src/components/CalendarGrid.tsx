import React from 'react';
import { format } from 'date-fns';
import { getMonthDays, getWeekDays } from '../utils/calendar';
import { Activity } from '../types/activity';

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

  const getDayColor = (activities: Activity[]) => {
    if (!activities?.length) return '';
    
    const hasPublic = activities.some(activity => activity.visibility === 'public');
    const hasPrivate = activities.some(activity => activity.visibility === 'private');
    
    if (hasPublic && hasPrivate) return 'bg-purple-50';
    if (hasPublic) return 'bg-green-50';
    return 'bg-blue-50';
  };

  const getDayIndicator = (activities: Activity[]) => {
    if (!activities?.length) return null;
    
    const hasPublic = activities.some(activity => activity.visibility === 'public');
    const hasPrivate = activities.some(activity => activity.visibility === 'private');
    
    if (hasPublic && hasPrivate) {
      return <div className="w-2 h-2 bg-purple-500 rounded-full" />;
    }
    if (hasPublic) {
      return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    }
    return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
  };

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
        const dayActivities = activities[dateKey] || [];

        return (
          <div
            key={day.toString()}
            style={isFirstDay ? { gridColumnStart: dayOfWeek + 1 } : undefined}
            className={`p-4 border text-center hover:bg-gray-50 cursor-pointer relative ${
              getDayColor(dayActivities)
            }`}
            onClick={() => onDayClick(day)}
          >
            {format(day, 'd')}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              {getDayIndicator(dayActivities)}
            </div>
          </div>
        );
      })}
    </div>
  );
};