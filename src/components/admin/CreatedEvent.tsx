import React, { useState, useEffect } from 'react';
import { sendEvents, updateEvents, getEventsAll, deleteEvents } from '../../services/eventService';
import type { EventStatus, EventFormErrors, EventData } from '../../types/index';


const CreatedEvent: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [errors, setErrors] = useState<Record<string, EventFormErrors>>({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await getEventsAll();

        const mappedEvents: EventData[] = response.events.map((event) => ({
          id: event.id,
          backendId: event.id,
          title: event.title,
          description: event.description,
          start_date: event.start_date,
          end_date: event.end_date,
          original_start_date: event.start_date,
          original_end_date: event.end_date,
          capacity: String(event.capacity),
          status: event.status,
          isDirty: false,
        }));

        setEvents(mappedEvents);
      } catch (err) {
        console.error(err);
      }
    };

    loadEvents();
  }, []);


  const createNewEmptyEvent = (): EventData => ({
    id: Date.now().toString(),
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    capacity: '',
    original_start_date: "",
    original_end_date: "",
    status: 'published',
    isDirty: false,
  });

  const addNewEvent = () => {
    const newEvent = createNewEmptyEvent();
    setEvents(prev => [...prev, newEvent]);
  };

  const removeEvent = (eventId: string) => {
    if (events.length > 1) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      if (errors[eventId]) {
        const newErrors = { ...errors };
        delete newErrors[eventId];
        setErrors(newErrors);
      }
    }
  };

  const handleEventChange = (eventId: string, field: keyof EventData, value: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, [field]: value, isDirty: true }
        : event
    ));

    if (field === 'title' || field === 'description' || field === 'start_date' ||
      field === 'end_date' || field === 'capacity') {
      if (errors[eventId]?.[field as keyof EventFormErrors]) {
        setErrors(prev => ({
          ...prev,
          [eventId]: {
            ...prev[eventId],
            [field]: undefined
          }
        }));
      }
    }
  };

  const handleStatusChange = (eventId: string, value: EventStatus) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, status: value, isDirty: true }
        : event
    ));
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const validateEvent = (event: EventData): EventFormErrors => {
    const eventErrors: EventFormErrors = {};

    if (!event.title.trim()) eventErrors.title = 'Título requerido';
    if (!event.description.trim()) eventErrors.description = 'Descripción requerida';

    if (!event.start_date) {
      eventErrors.start_date = 'Fecha inicio requerida';
    } else if (new Date(event.start_date) < new Date()) {
      eventErrors.start_date = 'No puede ser en el pasado';
    }

    if (!event.end_date) {
      eventErrors.end_date = 'Fecha fin requerida';
    } else if (event.start_date && new Date(event.end_date) <= new Date(event.start_date)) {
      eventErrors.end_date = 'Debe ser posterior a inicio';
    }

    if (!event.capacity) {
      eventErrors.capacity = 'Capacidad requerida';
    } else if (parseInt(event.capacity) <= 0) {
      eventErrors.capacity = 'Debe ser mayor a 0';
    }
    const startDateChanged =
      event.start_date !== event.original_start_date;

    if (!event.start_date) {
      eventErrors.start_date = 'Fecha inicio requerida';
    } else if (
      startDateChanged &&
      new Date(event.start_date) < new Date()
    ) {
      eventErrors.start_date = 'No puede ser en el pasado';
    }


    return eventErrors;
  };

  const createEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const eventErrors = validateEvent(event);

    if (Object.keys(eventErrors).length > 0) {
      setErrors(prev => ({ ...prev, [eventId]: eventErrors }));
      alert('Corrija los errores antes de crear');
      return;
    }

    // llamada al backend
    const responseData = sendEvents({
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      capacity: parseInt(event.capacity),
      status: event.status
    })

    const backendId = `backend-${Date.now()}`;

    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, backendId, isDirty: false }
        : e
    ));

    console.log(responseData)
  };

  const updateEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event || !event.backendId) {
      alert('Este evento no existe en el backend. Use "Crear" primero.');
      return;
    }

    const eventErrors = validateEvent(event);

    if (Object.keys(eventErrors).length > 0) {
      setErrors(prev => ({ ...prev, [eventId]: eventErrors }));
      alert('Corrija los errores antes de actualizar');
      return;
    }

    updateEvents({
      id: event.backendId,
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      capacity: parseInt(event.capacity),
      status: event.status
    })

    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, isDirty: false }
        : e
    ));

    alert(`Evento "${event.title}" actualizado exitosamente`);
  };

  const deleteEvent = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (!event.backendId) {
      alert(eventId)
      removeEvent(eventId);
      alert('Borrador de evento eliminado');
      return;
    }

    try {
      const response = await deleteEvents(event.backendId);

      if (!response.success) {
        alert('No se pudo eliminar el evento');
        return;
      }

      removeEvent(eventId);
      alert(`Evento "${event.title}" eliminado`);
    } catch (error) {
      console.error(error);
      alert('Error eliminando el evento');
    }
  };

  // const clearEvent = (eventId: string) => {
  //   setEvents(prev => prev.map(event => 
  //     event.id === eventId 
  //       ? createNewEmptyEvent()
  //       : event
  //   ));

  //   if (errors[eventId]) {
  //     const newErrors = { ...errors };
  //     delete newErrors[eventId];
  //     setErrors(newErrors);
  //   }
  // };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={addNewEvent}
            className="bg-[#9ACD32] text-black-200 px-4 py-2 rounded-lg hover:bg-[#9ACD32] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Evento
          </button>
        </div>

        <div className="space-y-8">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`p-6 border-2 rounded-lg bg-white shadow-sm ${event.isDirty ? 'border-yellow-300' : 'border-indigo-100'
                }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Evento #{index + 1}
                  </h3>
                  {event.backendId && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Guardado
                    </span>
                  )}
                  {event.isDirty && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Cambios sin guardar
                    </span>
                  )}
                </div>

                {events.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Quitar evento de la vista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Fila 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => handleEventChange(event.id, 'title', e.target.value)}
                    placeholder="Nombre del evento"
                    className={`w-full p-3 border bg-indigo-50 rounded-lg ${errors[event.id]?.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[event.id]?.title && (
                    <p className="text-red-500 text-xs mt-1">{errors[event.id]?.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDate(event.start_date)}
                    onChange={(e) => handleEventChange(event.id, 'start_date', e.target.value)}
                    className={`w-full p-3 border bg-indigo-50 rounded-lg ${errors[event.id]?.start_date ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[event.id]?.start_date && (
                    <p className="text-red-500 text-xs mt-1">{errors[event.id]?.start_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDate(event.end_date)}
                    onChange={(e) => handleEventChange(event.id, 'end_date', e.target.value)}
                    className={`w-full p-3 border bg-indigo-50 rounded-lg ${errors[event.id]?.end_date ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[event.id]?.end_date && (
                    <p className="text-red-500 text-xs mt-1">{errors[event.id]?.end_date}</p>
                  )}
                </div>
              </div>

              {/* Fila 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={event.description}
                    onChange={(e) => handleEventChange(event.id, 'description', e.target.value)}
                    rows={3}
                    placeholder="Descripción del evento"
                    className={`w-full p-3 border bg-indigo-50 rounded-lg ${errors[event.id]?.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[event.id]?.description && (
                    <p className="text-red-500 text-xs mt-1">{errors[event.id]?.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad *
                  </label>
                  <input
                    type="number"
                    value={event.capacity}
                    onChange={(e) => handleEventChange(event.id, 'capacity', e.target.value)}
                    placeholder="Número de asistentes"
                    min="1"
                    className={`w-full p-3 border bg-indigo-50 rounded-lg ${errors[event.id]?.capacity ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[event.id]?.capacity && (
                    <p className="text-red-500 text-xs mt-1">{errors[event.id]?.capacity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={event.status}
                    onChange={(e) => handleStatusChange(event.id, e.target.value as EventStatus)}
                    className="w-full p-3 border bg-indigo-50 rounded-lg border-gray-300"
                  >
                    <option value="published">PUBLISHED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Se enviará como: "{event.status}"
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => createEvent(event.id)}
                  disabled={!!event.backendId}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${event.backendId
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
                  onClick={() => updateEvent(event.id)}
                  disabled={!event.backendId || !event.isDirty}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${!event.backendId || !event.isDirty
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
                  onClick={() => deleteEvent(event.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatedEvent;