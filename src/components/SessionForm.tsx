import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CreateSubmit from './buttons/CreateSubmit';
import ResetFormat from './buttons/ResetFormat';

// Definir tipos
type SessionData = {
  id: string; // Para identificación interna
  event_id: string;
  time_slot_id: string;
  title: string;
  capacity: string;
  description: string;
};

type SessionFormErrors = {
  global?: string;
  sessions?: Record<string, {
    event_id?: string;
    time_slot_id?: string;
    title?: string;
    capacity?: string;
    description?: string;
  }>;
};

// Mock de datos (reemplazar con llamadas API)
const mockEvents = [
  { id: 'event-1', title: 'Conferencia Anual 2024' },
  { id: 'event-2', title: 'Workshop de Innovación' },
  { id: 'event-3', title: 'Reunión de Accionistas Q4' },
];

const mockTimeSlots = [
  { id: 'slot-1', time_range: '09:00 - 10:30' },
  { id: 'slot-2', time_range: '11:00 - 12:30' },
  { id: 'slot-3', time_range: '14:00 - 15:30' },
  { id: 'slot-4', time_range: '16:00 - 17:30' },
];

const SessionForm: React.FC = () => {
  // Estado inicial con una sesión vacía
  const initialSession: SessionData = {
    id: Date.now().toString(),
    event_id: '',
    time_slot_id: '',
    title: '',
    capacity: '',
    description: '',
  };

  const [sessions, setSessions] = useState<SessionData[]>([initialSession]);
  const [errors, setErrors] = useState<SessionFormErrors>({});

  // En producción, aquí harías fetch de datos
  useEffect(() => {
    // Ejemplo: fetchEvents().then(setEvents);
    // Ejemplo: fetchTimeSlots().then(setTimeSlots);
  }, []);

  // Manejar cambios en una sesión específica
  const handleSessionChange = (sessionId: string, field: keyof SessionData, value: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, [field]: value }
        : session
    ));

    // Limpiar errores del campo modificado
    if (errors.sessions?.[sessionId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        sessions: {
          ...prev.sessions,
          [sessionId]: {
            ...prev.sessions?.[sessionId],
            [field]: undefined
          }
        }
      }));
    }
  };

  // Agregar nueva sesión
  const addNewSession = () => {
    const newSession: SessionData = {
      id: Date.now().toString(),
      event_id: '',
      time_slot_id: '',
      title: '',
      capacity: '',
      description: '',
    };
    
    setSessions(prev => [...prev, newSession]);
  };

  // Eliminar una sesión
  const removeSession = (sessionId: string) => {
    if (sessions.length > 1) {
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // Limpiar errores de la sesión eliminada
      if (errors.sessions?.[sessionId]) {
        setErrors(prev => {
          const newSessions = { ...prev.sessions };
          delete newSessions[sessionId];
          return { ...prev, sessions: newSessions };
        });
      }
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const sessionErrors: Record<string, any> = {};
    let hasErrors = false;

    sessions.forEach((session, index) => {
      const sessionError: any = {};

      // Validar evento
      if (!session.event_id) {
        sessionError.event_id = 'Seleccione un evento';
        hasErrors = true;
      }

      // Validar time slot
      if (!session.time_slot_id) {
        sessionError.time_slot_id = 'Seleccione un horario';
        hasErrors = true;
      }

      // Validar título
      if (!session.title.trim()) {
        sessionError.title = 'El título es requerido';
        hasErrors = true;
      } else if (session.title.trim().length < 3) {
        sessionError.title = 'El título debe tener al menos 3 caracteres';
        hasErrors = true;
      }

      // Validar capacidad
      if (!session.capacity) {
        sessionError.capacity = 'La capacidad es requerida';
        hasErrors = true;
      } else if (parseInt(session.capacity) <= 0) {
        sessionError.capacity = 'La capacidad debe ser mayor a 0';
        hasErrors = true;
      }

      if (Object.keys(sessionError).length > 0) {
        sessionErrors[session.id] = sessionError;
      }
    });

    setErrors({ sessions: sessionErrors });
    return !hasErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      // Preparar datos para enviar al backend
      const dataToSend = sessions.map(session => ({
        event_id: session.event_id,
        time_slot_id: session.time_slot_id,
        title: session.title.trim(),
        capacity: parseInt(session.capacity),
        description: session.description.trim() || null,
      }));

      console.log('Datos de sesiones a enviar:', dataToSend);
      
      // Aquí iría tu llamada a la API
      // fetch('/api/sessions/bulk', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ sessions: dataToSend })
      // })
      
      alert(`${sessions.length} sesión(es) lista(s) para enviar. Aquí llamarías a tu API.`);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setSessions([initialSession]);
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-800">Crear Sesiones del Evento</h2>
          <button
            type="button"
            onClick={addNewSession}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Añadir Sesión
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {sessions.map((session, index) => (
            <div key={session.id} className="p-6 border-2 border-indigo-100 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Sesión #{index + 1}
                </h3>
                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSession(session.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Eliminar sesión"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Campos en grid horizontal */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Event ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evento *
                  </label>
                  <select
                    value={session.event_id}
                    onChange={(e) => handleSessionChange(session.id, 'event_id', e.target.value)}
                    className={`w-full p-2 border bg-indigo-50 rounded ${errors.sessions?.[session.id]?.event_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">-- Seleccionar --</option>
                    {mockEvents.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                  {errors.sessions?.[session.id]?.event_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.sessions[session.id]?.event_id}</p>
                  )}
                </div>

                {/* Time Slot ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horario *
                  </label>
                  <select
                    value={session.time_slot_id}
                    onChange={(e) => handleSessionChange(session.id, 'time_slot_id', e.target.value)}
                    className={`w-full p-2 border bg-indigo-50 rounded ${errors.sessions?.[session.id]?.time_slot_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">-- Seleccionar --</option>
                    {mockTimeSlots.map(slot => (
                      <option key={slot.id} value={slot.id}>
                        {slot.time_range}
                      </option>
                    ))}
                  </select>
                  {errors.sessions?.[session.id]?.time_slot_id && (
                    <p className="text-red-500 text-xs mt-1">{errors.sessions[session.id]?.time_slot_id}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={session.title}
                    onChange={(e) => handleSessionChange(session.id, 'title', e.target.value)}
                    placeholder="Título de la sesión"
                    className={`w-full p-2 border bg-indigo-50 rounded ${errors.sessions?.[session.id]?.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.sessions?.[session.id]?.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.sessions[session.id]?.title}</p>
                  )}
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidad *
                  </label>
                  <input
                    type="number"
                    value={session.capacity}
                    onChange={(e) => handleSessionChange(session.id, 'capacity', e.target.value)}
                    placeholder="0"
                    min="1"
                    className={`w-full p-2 border bg-indigo-50 rounded ${errors.sessions?.[session.id]?.capacity ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.sessions?.[session.id]?.capacity && (
                    <p className="text-red-500 text-xs mt-1">{errors.sessions[session.id]?.capacity}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={session.description}
                    onChange={(e) => handleSessionChange(session.id, 'description', e.target.value)}
                    placeholder="Descripción opcional"
                    className="w-full p-2 border bg-indigo-50 rounded border-gray-300"
                  />
                </div>
              </div>

              {/* Contador de caracteres para título */}
              <div className="mt-2 text-xs text-gray-500">
                Título: {session.title.length}/100 caracteres
              </div>
            </div>
          ))}

          {/* Botones principales */}
          <div className="flex gap-3 pt-4">
            <CreateSubmit name="Crear Sesiones" />
            <ResetFormat name="Limpiar Todo" onClick={resetForm} />
          </div>
        </form>

        {/* Vista previa de datos */}
        {/* <div className="mt-8 p-4 bg-gray-50 rounded">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Datos a enviar al backend:</h3>
            <span className="text-sm text-gray-500">
              {sessions.length} sesión(es) configurada(s)
            </span>
          </div>
          <pre className="text-sm text-gray-600 overflow-x-auto max-h-60 overflow-y-auto">
            {JSON.stringify(
              sessions.map(session => ({
                event_id: session.event_id,
                time_slot_id: session.time_slot_id,
                title: session.title,
                capacity: session.capacity ? parseInt(session.capacity) : 0,
                description: session.description || null,
              })),
              null,
              2
            )}
          </pre>
        </div> */}
      </div>
    </div>
  );
};

export default SessionForm;