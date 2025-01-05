import React from 'react';
import { Activity, ActivityStatus } from '../types/activity';
import { getStatusLabel } from '../utils/status';

interface ActivityFormProps {
  initialValues?: Partial<Activity>;
  onSubmit: (values: Partial<Activity>) => void;
  submitLabel: string;
  showStatus?: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  initialValues = {},
  onSubmit,
  submitLabel,
  showStatus = false,
}) => {
  const [title, setTitle] = React.useState(initialValues.title || '');
  const [startTime, setStartTime] = React.useState(initialValues.start_time || '');
  const [endTime, setEndTime] = React.useState(initialValues.end_time || '');
  const [description, setDescription] = React.useState(initialValues.description || '');
  const [visibility, setVisibility] = React.useState<'public' | 'private'>(
    initialValues.visibility || 'private'
  );
  const [status, setStatus] = React.useState<ActivityStatus>(
    initialValues.status || 'aguardando_atendimento'
  );
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'O título é obrigatório';
    if (!startTime) newErrors.start_time = 'A hora inicial é obrigatória';
    if (!endTime) newErrors.end_time = 'A hora final é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title,
      start_time: startTime,
      end_time: endTime,
      description,
      visibility,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full p-2 border rounded"
          placeholder="Digite o título da atividade"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full p-2 border rounded"
          rows={3}
          placeholder="Descreva os detalhes da atividade"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
          className="mt-1 w-full p-2 border rounded"
        >
          <option value="private">Privada</option>
          <option value="public">Pública</option>
        </select>
      </div>

      {showStatus && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ActivityStatus)}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="reservado">{getStatusLabel('reservado')}</option>
            <option value="confirmado">{getStatusLabel('confirmado')}</option>
            <option value="atendimento_realizado">{getStatusLabel('atendimento_realizado')}</option>
            <option value="aguardando_atendimento">{getStatusLabel('aguardando_atendimento')}</option>
            <option value="cancelado">{getStatusLabel('cancelado')}</option>
          </select>
        </div>
      )}

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

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {submitLabel}
      </button>
    </form>
  );
};