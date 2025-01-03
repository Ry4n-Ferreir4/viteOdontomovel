import React, { useState } from 'react';
import { Activity } from '../types/activity';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  activities: Activity[];
  onAddActivity: (activity: Activity) => void;
  onEditActivity: (id: string, updatedActivity: Partial<Activity>) => void;
  onDeleteActivity: (id: string) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  date,
  activities,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errors, setErrors] = useState<{ start_time?: string; end_time?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Limpa erros antes de uma nova tentativa de adição
    setErrors({});

    // Validação dos campos
    const newErrors: { start_time?: string; end_time?: string } = {};
    if (!startTime) {
      newErrors.start_time = 'A hora inicial é obrigatória';
    }
    if (!endTime) {
      newErrors.end_time = 'A hora final é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (title && startTime && endTime) {
      onAddActivity({
        id: Date.now().toString(), // ID gerado dinamicamente
        title,
        date: date.toISOString().split('T')[0], // Apenas a data (sem o horário)
        start_time: startTime,
        end_time: endTime,
      });
      setTitle('');
      setStartTime('');
      setEndTime('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Atividades para {date.toLocaleDateString('pt-BR')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Atividade</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Digite a atividade"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Hora Inicial</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Hora Final</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Adicionar Atividade
          </button>
        </form>

        <div className="space-y-2">
          <h3 className="font-medium">Atividades do dia:</h3>
          {activities.length === 0 ? (
            <p className="text-gray-500">Nenhuma atividade cadastrada</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center py-2 border-b">
                <span>{activity.title}</span>
                <div className="flex space-x-2">
                  <button
                    className="text-red-500"
                  >
                    👁
                  </button>
                  <button
                    onClick={() => onEditActivity(activity.id, { title: activity.title })}
                    className="text-blue-500"
                  >
                    ✏
                  </button>
                  <button
                    onClick={() => onDeleteActivity(activity.id)}
                    className="text-red-500"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
