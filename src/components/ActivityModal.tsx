import React, { useState, useEffect } from 'react';
import { Activity } from '../types/activity';
import { ActivityForm } from './ActivityForm';
import { supabase } from '../lib/supabase';
import { getStatusLabel, getStatusColor } from '../utils/status';

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
  const [user, setUser] = useState<any>(null);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  if (!isOpen) return null;

  const handleAddActivity = (values: Partial<Activity>) => {
    onAddActivity({
      id: Date.now().toString(),
      title: values.title || '',
      date: date.toISOString().split('T')[0],
      start_time: values.start_time || '',
      end_time: values.end_time || '',
      description: values.description || '',
      visibility: values.visibility || 'private',
      status: values.status || 'aguardando_atendimento',
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteActivity(id);
    } finally {
      setDeletingId(null);
    }
  };

  const isCreator = (activity: Activity) => {
    return activity.user_id === user?.id;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Atividades para {date.toLocaleDateString('pt-BR')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <ActivityForm
          onSubmit={handleAddActivity}
          submitLabel="Adicionar Atividade"
        />

        <div className="mt-6 space-y-2">
          <h3 className="font-medium">Atividades do dia:</h3>
          {activities.length === 0 ? (
            <p className="text-gray-500">Nenhuma atividade cadastrada</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{activity.title}</span>
                  <span className="block text-sm text-gray-500">
                    {activity.start_time} - {activity.end_time}
                  </span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      activity.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.visibility === 'public' ? 'Pública' : 'Privada'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(activity.status)}`}>
                      {getStatusLabel(activity.status)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewingActivity(activity)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    👁
                  </button>
                  {isCreator(activity) && (
                    <>
                      <button
                        onClick={() => setEditingActivity(activity)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={deletingId === activity.id}
                      >
                        {deletingId === activity.id ? '⌛' : '❌'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {viewingActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detalhes da Atividade</h3>
              <button onClick={() => setViewingActivity(null)} className="text-gray-500">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Título</label>
                <p className="mt-1">{viewingActivity.title}</p>
              </div>
              {viewingActivity.description && (
                <div>
                  <label className="block text-sm font-medium">Descrição</label>
                  <p className="mt-1 whitespace-pre-wrap">{viewingActivity.description}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium">Status</label>
                <p className={`mt-1 inline-block px-2 py-1 rounded ${getStatusColor(viewingActivity.status)}`}>
                  {getStatusLabel(viewingActivity.status)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Horário</label>
                <p className="mt-1">{viewingActivity.start_time} - {viewingActivity.end_time}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Visibilidade</label>
                <p className="mt-1">{viewingActivity.visibility === 'public' ? 'Pública' : 'Privada'}</p>
              </div>
            </div>
            <button
              onClick={() => setViewingActivity(null)}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {editingActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Editar Atividade</h3>
              <button onClick={() => setEditingActivity(null)} className="text-gray-500">✕</button>
            </div>
            <ActivityForm
              initialValues={editingActivity}
              onSubmit={(values) => {
                onEditActivity(editingActivity.id, values);
                setEditingActivity(null);
              }}
              submitLabel="Salvar Alterações"
              showStatus={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};