import React, { useState } from 'react';
import { Activity } from '../types/activity';

interface EditActivityModalProps {
  activity: Activity;
  onClose: () => void;
  onSave: (updatedActivity: Partial<Activity>) => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({ 
  activity, 
  onClose, 
  onSave 
}) => {
  const [title, setTitle] = useState(activity.title);
  const [startTime, setStartTime] = useState(activity.start_time);
  const [endTime, setEndTime] = useState(activity.end_time);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};
    if (!startTime) newErrors.start_time = 'A hora inicial é obrigatória';
    if (!endTime) newErrors.end_time = 'A hora final é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title,
      start_time: startTime,
      end_time: endTime,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Editar Atividade</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hora Inicial</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
            {errors.start_time && (
              <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hora Final</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
            {errors.end_time && (
              <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}