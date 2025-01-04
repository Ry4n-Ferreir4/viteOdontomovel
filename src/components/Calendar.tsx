import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { ActivityModal } from './ActivityModal';
import { Activity } from '../types/activity';
import { supabase } from '../lib/supabase';

export function Calendar() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activities, setActivities] = useState<{ [key: string]: Activity[] }>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      console.log('Loading activities...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .or(`user_id.eq.${user?.id},visibility.eq.public`);

      if (error) throw error;

      console.log('Activities loaded:', data);

      const groupedActivities = data.reduce((acc: { [key: string]: Activity[] }, activity) => {
        const dateKey = activity.date;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push({
          ...activity,
          start_time: activity.start_time || '', // Fallback para evitar undefined
          end_time: activity.end_time || '', // Fallback para evitar undefined
        });
        return acc;
      }, {});

      setActivities(groupedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAddActivity = async (activity: Activity) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not logged in');
      return;
    }
  
    if (selectedDate) {
      const newErrors: { [key: string]: string } = {};
      if (!activity.start_time) newErrors.start_time = 'A hora inicial é obrigatória';
      if (!activity.end_time) newErrors.end_time = 'A hora final é obrigatória';
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      setLoading(true);
      try {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('activities')
          .insert([{
            title: activity.title,
            date: dateKey,
            start_time: activity.start_time || '', 
            end_time: activity.end_time || '',
            description: activity.description || '', // Adicionando o campo descrição
            user_id: user.id,
            visibility: activity.visibility,
          }])
          .select();
  
        if (error) throw error;
  
        if (data) {
          setActivities(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), data[0]],
          }));
          console.log('Activity added:', data[0]);
        }
      } catch (error) {
        console.error('Error adding activity:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-4 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">Odontomovel 2025</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
        >
          Sair
        </button>
      </div>

      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <CalendarHeader 
            currentMonth={currentMonth}
            onPrevMonth={() => setCurrentMonth(prev => (prev === 1 ? 12 : prev - 1))}
            onNextMonth={() => setCurrentMonth(prev => (prev === 12 ? 1 : prev + 1))}
          />
          <CalendarGrid 
            currentMonth={currentMonth} 
            onDayClick={(date) => {
              console.log('Day clicked:', date);
              setSelectedDate(date);
            }}
            activities={activities || {}} // Garantir que nunca seja undefined
          />
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-solid border-white border-t-transparent rounded-full"></div>
        </div>
      )}

      {selectedDate && (
        <ActivityModal
          isOpen={true}
          onClose={() => setSelectedDate(null)}
          date={selectedDate}
          activities={activities[selectedDate.toISOString().split('T')[0]] || []}
          onAddActivity={handleAddActivity}
          onEditActivity={async (id, updatedActivity) => {
            try {
              const { error } = await supabase
                .from('activities')
                .update(updatedActivity)
                .eq('id', id);

              if (error) throw error;

              console.log('Activity updated:', id);
              loadActivities();
            } catch (error) {
              console.error('Error updating activity:', error);
            }
          }}
          onDeleteActivity={async (id) => {
            try {
              const { error } = await supabase
                .from('activities')
                .delete()
                .eq('id', id);

              if (error) throw error;

              console.log('Activity deleted:', id);
              loadActivities();
            } catch (error) {
              console.error('Error deleting activity:', error);
            }
          }}
        />
      )}
    </div>
  );
}
