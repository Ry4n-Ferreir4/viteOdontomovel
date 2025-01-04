import React, { useState, useEffect } from 'react';
import { Activity } from '../types/activity';

interface ActivityItemProps {
  activity: Activity;
  onEdit: (id: string, updatedActivity: Partial<Activity>) => void;
  onDelete: (id: string) => void;
  user: any;  // Recebendo o usuário logado como prop
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onEdit, onDelete, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activity.title);
  const [startTime, setStartTime] = useState(activity.start_time);
  const [endTime, setEndTime] = useState(activity.end_time);

  useEffect(() => {
    // Atualiza os valores caso a atividade seja alterada externamente
    setTitle(activity.title);
    setStartTime(activity.start_time);
    setEndTime(activity.end_time);
  }, [activity]);

  const handleSave = () => {
    onEdit(activity.id, { title, start_time: startTime, end_time: endTime });
    setIsEditing(false);
  };

  // Log para depurar o display_name do usuário
  useEffect(() => {
    if (user) {
      console.log('Usuário logado:', user);  // Verificando todo o objeto user
      if (user.display_name) {
        console.log('Display name encontrado:', user.display_name);  // Verificando o display_name especificamente
      } else {
        console.log('Display name não encontrado no objeto user');
      }
    } else {
      console.log('Nenhum usuário logado');
    }
  }, [user]);

  // Log para garantir que as variáveis de estado estão sendo definidas corretamente
  useEffect(() => {
    console.log('Atividade Atual:', activity);
    console.log('Título:', title, 'Hora Inicial:', startTime, 'Hora Final:', endTime);
  }, [activity, title, startTime, endTime]);

  if (isEditing) {
    return (
      <div className="p-2 bg-gray-50 rounded space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Inicial:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora Final:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 bg-gray-50 rounded flex justify-between items-center">
      <div>
        <div className="flex items-center space-x-2">
          {/* Exibindo o nome do usuário logado ao lado do título */}
          {user && user.display_name ? (
            <span className="text-sm text-gray-600">Olá, {user.display_name}</span>
          ) : (
            <span className="text-sm text-gray-600">Usuário não encontrado</span>
          )}
          <span>{activity.title}</span>
        </div>
        <span className="block text-sm text-gray-500">{activity.start_time} - {activity.end_time}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-600"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(activity.id)}
          className="text-red-500 hover:text-red-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};
