import React, { useState, useEffect } from 'react';
import { getEventSlot, sendSession, deleteSessionService, getSessions } from "../../services/sessionService"
import { getSpeakersAll } from "../../services/speakerService"

import type { EventWithSlots, responseSpeaker } from "../../types/index"

// Definir tipos
type SessionData = {
  id: string;
  backendId?: string;
  event_id: string;
  time_slot_id: string;
  title: string;
  capacity: string;
  description: string;
  speaker_id: string;   // ✅ AQUÍ
  isDirty?: boolean;
};

type SessionDataWithSpeaker = {
  id: string; // ID interno para la vista
  backendId?: string; // ID asignado por el backend
  event_id: string;
  time_slot_id: string;
  title: string;
  capacity: string;
  description: string;
  speaker: string;
  isDirty?: boolean;

};
type SessionFormErrors = {
  event_id?: string;
  time_slot_id?: string;
  title?: string;
  capacity?: string;
  description?: string;
};



const mockExistingSessions: SessionData[] = [
  {
    id: 'session-1',
    backendId: 'backend-session-1',
    event_id: 'event-1',
    time_slot_id: 'slot-1',
    title: 'Sesión de Apertura',
    capacity: '100',
    description: 'Introducción y bienvenida al evento',

    isDirty: false,
  },
  {
    id: 'session-2',
    backendId: 'backend-session-2',
    event_id: 'event-1',
    time_slot_id: 'slot-2',
    title: 'Workshop Práctico',
    capacity: '50',
    description: 'Taller interactivo sobre nuevas tecnologías',

    isDirty: false,
  },
];

const SessionForm: React.FC = () => {
  // Estado inicial
  const [sessions, setSessions] = useState<SessionData[]>(mockExistingSessions);
  const [events, setEvents] = useState<EventWithSlots[]>([])
  const [errors, setErrors] = useState<Record<string, SessionFormErrors>>({});
  const [reloadSession, setReloadSession] = useState(0)
  const [speaker, setSpeaker] = useState<responseSpeaker[]>();

  // Crear nueva sesión vacía
  const createNewEmptySession = (): SessionData => ({
    id: Date.now().toString(),
    event_id: '',
    time_slot_id: '',
    title: '',
    capacity: '',
    description: '',
    speaker_id: "",
    isDirty: false,
  });


  const getTimeSlotsForSession = (session: SessionData) => {
    if (!session.event_id) return [];

    const event = events.find(e => e.id === session.event_id);
    return event?.time_slot ?? [];
  };



  useEffect(() => {
    const loadEventSlot = async () => {
      try {
        const response = await getEventSlot();
        console.log(response);

        setEvents(response.events)


      } catch (err) {
        console.error(err);
      }
    };

    loadEventSlot();
  }, []);// meter el estado q cambia lso eventos o el horario
  // si cambia solo los speaker
  useEffect(() => {
    const loadEspeakerSlot = async () => {
      try {
        const response = await getSpeakersAll()

        setSpeaker(response.speaker)


      } catch (err) {
        console.error(err);
      }
    };

    loadEspeakerSlot();
  }, []);// meter el estado q cambia lso eventos o el horario

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await getSessions();

        const mappedSession: SessionData[] = response.session.map((session) => ({
          id: session.id,
          event_id: session.event_id,
          time_slot_id: session.time_slot_id,
          backendId: session.id,
          title: session.title,
          capacity: String(session.capacity),
          speaker_id: session.speaker_id,
          description: session.description,
          isDirty: false,
        }));
        setSessions(mappedSession)
        // setReloadSession();
      } catch (err) {
        console.error(err);
      }
    };

    loadSession();
  }, [reloadSession]);


  // Agregar nueva sesión
  const addNewSession = () => {
    const newSession = createNewEmptySession();
    setSessions(prev => [...prev, newSession]);
  };

  // Eliminar sesión de la vista
  const removeSession = (sessionId: string) => {
    if (sessions.length > 1) {
      setSessions(prev => prev.filter(session => session.id !== sessionId));

      if (errors[sessionId]) {
        const newErrors = { ...errors };
        delete newErrors[sessionId];
        setErrors(newErrors);
      }
    }
  };

  // Manejar cambios en una sesión específica
  const handleSessionChange = (sessionId: string, field: keyof SessionData, value: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, [field]: value, isDirty: true }
        : session
    ));

    // Solo limpiar errores para campos que tienen validación
    if (field === 'event_id' || field === 'time_slot_id' ||
      field === 'title' || field === 'capacity' || field === 'description') {
      if (errors[sessionId]?.[field as keyof SessionFormErrors]) {
        setErrors(prev => ({
          ...prev,
          [sessionId]: {
            ...prev[sessionId],
            [field]: undefined
          }
        }));
      }
    }
  };

  // Validar una sesión específica
  const validateSession = (session: SessionData): SessionFormErrors => {
    const sessionErrors: SessionFormErrors = {};

    // Validar evento
    if (!session.event_id) {
      sessionErrors.event_id = 'Seleccione un evento';
    }

    // Validar time slot
    if (!session.time_slot_id) {
      sessionErrors.time_slot_id = 'Seleccione un horario';
    }

    // Validar título
    if (!session.title.trim()) {
      sessionErrors.title = 'El título es requerido';
    } else if (session.title.trim().length < 3) {
      sessionErrors.title = 'El título debe tener al menos 3 caracteres';
    } else if (session.title.trim().length > 100) {
      sessionErrors.title = 'El título no puede exceder 100 caracteres';
    }

    // Validar capacidad
    if (!session.capacity) {
      sessionErrors.capacity = 'La capacidad es requerida';
    } else if (parseInt(session.capacity) <= 0) {
      sessionErrors.capacity = 'La capacidad debe ser mayor a 0';
    } else if (parseInt(session.capacity) > 1000) {
      sessionErrors.capacity = 'La capacidad no puede exceder 1000 personas';
    }

    // Validar descripción (opcional pero con límite)
    if (session.description.length > 500) {
      sessionErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    return sessionErrors;
  };

  // Crear sesión (POST al backend)
  const createSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const sessionErrors = validateSession(session);

    if (Object.keys(sessionErrors).length > 0) {
      setErrors(prev => ({ ...prev, [sessionId]: sessionErrors }));
      alert('Corrija los errores antes de crear');
      return;
    }

    // llamada al backend
    const payload = {
      event_id: session.event_id,
      time_slot_id: session.time_slot_id,
      title: session.title.trim(),
      capacity: parseInt(session.capacity),
      description: session.description.trim(),
      speaker_id: session.speaker_id,
    };

    try {
      const response = await sendSession(payload);
      const backendId = `backend-session-${Date.now()}`;
      console.log("Backen response", response)

      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, backendId, isDirty: false }
          : s
      ));
      console.log(`Sesión "${session.title}" creada exitosamente`);

    } catch (error) {
      console.error(error)
    }

  };

  // Actualizar sesión (PUT al backend)
  const updateSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session || !session.backendId) {
      alert('Esta sesión no existe en el backend. Use "Crear" primero.');
      return;
    }

    const sessionErrors = validateSession(session);

    if (Object.keys(sessionErrors).length > 0) {
      setErrors(prev => ({ ...prev, [sessionId]: sessionErrors }));
      alert('Corrija los errores antes de actualizar');
      return;
    }
    try {

      // llamada al backend
      const payload = {
        id: session.backendId,
        event_id: session.event_id,
        time_slot_id: session.time_slot_id,
        title: session.title.trim(),
        capacity: parseInt(session.capacity),
        description: session.description.trim() || null,
        speaker_id: session.speaker_id
      }


      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, isDirty: false }
          : s
      ));
      const response = await updateSession(payload)
      console.log(`Sesión "${response.title}" actualizada exitosamente`);
    } catch (error) {
      console.error(error)
    }
  };

  // Eliminar sesión del backend (DELETE)
  const deleteSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    try {

      // Simulación de llamada al backend
      const response = deleteSessionService(sessionId)
      if (!(await response).success) {
        console.log("No se pudo eliminar el speaker")
        return
      }
      console.log(`Session "${session.id}" eliminado del backend`);
      //setReloadSpeakers(prev => prev + 1);

    } catch (error) {
      console.log(error);

    }
    setReloadSession(prev => prev + 1);


    if (!session.backendId) {
      removeSession(sessionId);
      alert('Borrador de sesión eliminado');
      return;
    }

    removeSession(sessionId);
    alert(`Sesión "${session.title}" eliminada del backend`);
  };

  // Limpiar sesión
  const clearSession = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? createNewEmptySession()
        : session
    ));

    if (errors[sessionId]) {
      const newErrors = { ...errors };
      delete newErrors[sessionId];
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={addNewSession}
            className="bg-[#9ACD32] text-black-200 px-4 py-2 rounded-lg hover:bg-[#9ACD32] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Sesión
          </button>
        </div>

        {/* Lista de sesiones */}
        <div className="space-y-8">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className={`p-6 border-2 rounded-lg bg-white shadow-sm ${session.isDirty ? 'border-yellow-300' : 'border-indigo-100'
                }`}
            >
              {/* Header de la sesión */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Sesión #{index + 1}
                  </h3>
                  {session.backendId && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Guardada
                    </span>
                  )}
                  {session.isDirty && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Cambios sin guardar
                    </span>
                  )}
                </div>

                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSession(session.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Quitar sesión de la vista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Campos en grid horizontal */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                {/* Event ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evento *
                  </label>
                  <select
                    value={session.event_id}
                    onChange={(e) => handleSessionChange(session.id, 'event_id', e.target.value)}
                    className={`w-full p-3 border bg-indigo-50 rounded ${errors[session.id]?.event_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">-- Seleccionar --</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                  {errors[session.id]?.event_id && (
                    <p className="text-red-500 text-xs mt-1">{errors[session.id]?.event_id}</p>
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
                    className={`w-full p-3 border bg-indigo-50 rounded ${errors[session.id]?.time_slot_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">-- Seleccionar --</option>
                    {getTimeSlotsForSession(session).map(slot => (
                      <option key={slot.id} value={slot.id}>
                        {slot.start_time} - {slot.end_time}
                      </option>
                    ))}

                  </select>
                  {errors[session.id]?.time_slot_id && (
                    <p className="text-red-500 text-xs mt-1">{errors[session.id]?.time_slot_id}</p>
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
                    className={`w-full p-3 border bg-indigo-50 rounded ${errors[session.id]?.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[session.id]?.title && (
                    <p className="text-red-500 text-xs mt-1">{errors[session.id]?.title}</p>
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
                    max="1000"
                    className={`w-full p-3 border bg-indigo-50 rounded ${errors[session.id]?.capacity ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[session.id]?.capacity && (
                    <p className="text-red-500 text-xs mt-1">{errors[session.id]?.capacity}</p>
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
                    className="w-full p-3 border bg-indigo-50 rounded border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speaker *
                  </label>

                  <select
                    value={session.speaker_id ?? ''}
                    onChange={(e) =>
                      setSessions(prev =>
                        prev.map(s =>
                          s.id === session.id
                            ? {
                              ...s,
                              speaker_id: e.target.value,
                              isDirty: true
                            }
                            : s
                        )
                      )
                    }
                    className={`w-full p-3 border bg-indigo-50 rounded ${errors[session.id]?.event_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Seleccione speaker</option>
                    {speaker?.map(speaker => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contadores de caracteres */}
              <div className="flex justify-between text-xs text-gray-500 mb-6">
                <div>
                  Título: {session.title.length}/100 caracteres
                </div>
                <div>
                  Descripción: {session.description.length}/500 caracteres
                </div>
              </div>

              {/* Botones CRUD */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => createSession(session.id)}
                  disabled={!!session.backendId}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${session.backendId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear
                </button>

                <button
                  type="button"
                  onClick={() => updateSession(session.id)}
                  disabled={!session.backendId || !session.isDirty}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${!session.backendId || !session.isDirty
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Actualizar
                </button>

                <button
                  type="button"
                  onClick={() => deleteSession(session.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>

                {/* <button
                  type="button"
                  onClick={() => clearSession(session.id)}
                  disabled={!session.event_id && !session.time_slot_id && !session.title && !session.capacity && !session.description}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    !session.event_id && !session.time_slot_id && !session.title && !session.capacity && !session.description
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpiar
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">{sessions.length}</p>
              <p className="text-sm text-blue-600">Sesiones en vista</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">
                {sessions.filter(s => s.backendId).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-700">
                {sessions.filter(s => s.isDirty).length}
              </p>
              <p className="text-sm text-yellow-600">Con cambios sin guardar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;