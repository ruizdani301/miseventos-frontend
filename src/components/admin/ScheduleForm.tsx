import React, { useState, useEffect } from 'react';
import { sendSchedule, updateSchedule, deleteSchedule as apiDeleteSchedule } from "../../services/scheduleService"
import { getEventsNameSlot } from "../../services/eventService"
import type { EventWithSlots, SlotTimeRange } from "../../types"

// Definir tipos
type TimeRange = {
  id: string;
  start_time: string;
  end_time: string;
};

type ScheduleData = {
  id: string; // ID interno para la vista
  backendId?: string; // ID asignado por el backend
  event_id: string;
  time_ranges: TimeRange[];
  is_assigned: boolean;
  isDirty?: boolean;
};

type EventData = {
  id: string;
  title: string;
  time_slot: TimeRange[]
  isDirty?: boolean;
}




type ScheduleFormErrors = {
  event_id?: string;
  time_ranges?: string;
};
// El mock ha sido eliminado para usar datos reales del backend.

const ScheduleForm: React.FC = () => {
  // Estado inicial
  const [schedule, setSchedule] = useState<ScheduleData>(createNewEmptySchedule());
  const [formErrors, setFormErrors] = useState<ScheduleFormErrors>({});
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const loadEventsName = async () => {
      try {
        const response = await getEventsNameSlot();

        // Helper de formateo local
        const formatTime = (timeStr: string) => {
          if (!timeStr) return "09:00";
          const parts = timeStr.split(':');
          if (parts.length < 2) return "09:00";
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        };

        const mappedEvents: EventData[] = response.events.map((event: EventWithSlots) => ({
          id: event.id,
          title: event.title,
          time_slot: (event.time_slot || []).map((slot: SlotTimeRange) => ({
            id: slot.id,
            start_time: formatTime(slot.start_time),
            end_time: formatTime(slot.end_time),
          })),
          isDirty: false,
        }));
        console.log(mappedEvents)
        setEvents(mappedEvents);
      } catch (err) {
        console.error(err);
      }
    };

    loadEventsName();
  }, []);
  // Generar opciones de hora (cada 30 minutos)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Crear nuevo horario vacío
  function createNewEmptySchedule(): ScheduleData {
    const initialTimeRange: TimeRange = {
      id: Date.now().toString(),
      start_time: '09:00',
      end_time: '17:00',
    };

    return {
      id: Date.now().toString(),
      event_id: '',
      time_ranges: [initialTimeRange],
      is_assigned: false,
      isDirty: false,
    };
  }

  // Manejar cambio de evento
  const handleEventChange = (value: string) => {
    if (!value) {
      setSchedule(createNewEmptySchedule());
      setFormErrors({});
      return;
    }

    // Buscar el evento seleccionado para extraer sus slots
    const selectedEvent = events.find(e => e.id === value);

    // Formatear las horas del backend (HH:mm:ss.ms) a HH:mm
    const formatTime = (timeStr: string) => {
      if (!timeStr) return "09:00";
      const [hours, minutes] = timeStr.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    // Identificar si el evento ya tiene horarios
    const hasSchedules = (selectedEvent?.time_slot || []).length > 0;

    // Crear los nuevos rangos basados en los slots del evento
    const newTimeRanges: TimeRange[] = hasSchedules
      ? (selectedEvent?.time_slot || []).map(slot => ({
        id: slot.id,
        start_time: formatTime(slot.start_time),
        end_time: formatTime(slot.end_time),
      }))
      : [{ id: Date.now().toString(), start_time: '09:00', end_time: '17:00' }]; // Rango inicial si no tiene

    setSchedule({
      id: `schedule-${value}`,
      event_id: value,
      time_ranges: newTimeRanges,
      backendId: hasSchedules ? value : undefined,
      is_assigned: hasSchedules,
      isDirty: false
    });

    setFormErrors({});
  };

  // Manejar cambio de checkbox
  const handleCheckboxChange = (checked: boolean) => {
    setSchedule(prev => ({ ...prev, is_assigned: checked, isDirty: true }));
  };

  const addTimeRange = () => {
    const newTimeRange: TimeRange = {
      id: Date.now().toString(),
      start_time: '09:00',
      end_time: '17:00',
    };

    setSchedule(prev => ({
      ...prev,
      time_ranges: [...prev.time_ranges, newTimeRange],
      isDirty: true
    }));
  };

  const removeTimeRange = (rangeId: string) => {
    setSchedule(prev => ({
      ...prev,
      time_ranges: prev.time_ranges.length > 1
        ? prev.time_ranges.filter(range => range.id !== rangeId)
        : prev.time_ranges,
      isDirty: true
    }));
  };

  const handleTimeRangeChange = (
    rangeId: string,
    field: 'start_time' | 'end_time',
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      time_ranges: prev.time_ranges.map(range =>
        range.id === rangeId
          ? { ...range, [field]: value }
          : range
      ),
      isDirty: true
    }));
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  // Validar un horario específico
  const validateSchedule = (schedule: ScheduleData): ScheduleFormErrors => {
    const scheduleErrors: ScheduleFormErrors = {};

    // Validar evento
    if (!schedule.event_id.trim()) {
      scheduleErrors.event_id = 'Seleccione un evento';
    }

    const hasInvalidTimeRange = schedule.time_ranges.some(range => {
      const [startHour, startMinute] = range.start_time.split(':').map(Number);
      const [endHour, endMinute] = range.end_time.split(':').map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      return endTotal <= startTotal;
    });

    if (hasInvalidTimeRange) {
      scheduleErrors.time_ranges = 'Algunos rangos tienen fin antes o igual al inicio';
    }

    return scheduleErrors;
  };

  // Crear horario (POST al backend)
  const handleCreateSchedule = async () => {
    const scheduleErrors = validateSchedule(schedule);

    if (Object.keys(scheduleErrors).length > 0) {
      setFormErrors(scheduleErrors);
      alert('Corrija los errores antes de crear');
      return;
    }

    // Asegurar formato HH:mm:00 para el backend
    const ensureSeconds = (timeStr: string) => {
      if (timeStr.split(':').length === 2) return `${timeStr}:00`;
      return timeStr;
    };

    const payload = {
      event_id: schedule.event_id,
      time_slots: schedule.time_ranges.map(range => ({
        id: range.id,
        start_time: ensureSeconds(range.start_time),
        end_time: ensureSeconds(range.end_time),
      })),
      is_assigned: schedule.is_assigned,
    };

    try {
      const response = await sendSchedule(payload);
      const backendId = response.id ?? schedule.event_id;

      setSchedule(prev => ({ ...prev, backendId, isDirty: false }));
      alert('Horario creado exitosamente');
    } catch (error) {
      console.error(error);
      alert('Error al crear el horario');
    }
  };


  // Actualizar horario (PUT al backend)
  const handleUpdateSchedule = async () => {
    if (!schedule.backendId) {
      alert('Este horario no existe en el backend. Use "Crear" primero.');
      return;
    }

    const scheduleErrors = validateSchedule(schedule);

    if (Object.keys(scheduleErrors).length > 0) {
      setFormErrors(scheduleErrors);
      alert('Corrija los errores antes de actualizar');
      return;
    }

    // Asegurar formato HH:mm:00 para el backend
    const ensureSeconds = (timeStr: string) => {
      if (timeStr.split(':').length === 2) return `${timeStr}:00`;
      return timeStr;
    };

    const payload = {
      event_id: schedule.event_id,
      time_slots: schedule.time_ranges.map(range => ({
        id: range.id,
        start_time: ensureSeconds(range.start_time),
        end_time: ensureSeconds(range.end_time),
      })),
      is_assigned: schedule.is_assigned,
    };

    try {
      await updateSchedule(payload);
      setSchedule(prev => ({ ...prev, isDirty: false }));
      alert('Horario actualizado exitosamente');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el horario');
    }
  };

  // Eliminar un rango de horas (Slot) del backend y de la vista
  const handleDeleteSlot = async (rangeId: string) => {
    // Si el ID parece ser un UUID del backend (contiene guiones), intentamos borrarlo en la DB
    if (rangeId.includes('-')) {
      try {
        await apiDeleteSchedule(rangeId);
        alert('Rango eliminado exitosamente');
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el rango del backend');
        return;
      }
    }

    removeTimeRange(rangeId);
  };

  // Limpiar formulario
  const clearForm = () => {
    setSchedule(createNewEmptySchedule());
    setFormErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600 text-md mt-1">Configure los horarios de disponibilidad para sus eventos</p>
          </div>
        </div>

        <div className="space-y-8">
          <div
            className={`p-6 border-2 rounded-lg bg-white shadow-sm ${schedule.isDirty ? 'border-yellow-300' : 'border-indigo-100'
              }`}
          >
            {/* Header del formulario */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {schedule.backendId ? 'Editar Horario' : 'Nuevo Horario'}
                </h3>
                {schedule.backendId && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Guardado en Servidor
                  </span>
                )}
                {schedule.isDirty && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Cambios sin guardar
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={clearForm}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                title="Limpiar formulario"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z" />
                </svg>
                Limpiar
              </button>
            </div>

            {/* Selector de Evento */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Seleccionar Evento *
              </label>
              <select
                value={schedule.event_id}
                onChange={(e) => handleEventChange(e.target.value)}
                className={`w-full p-3 border bg-[#D3D3D3] rounded-lg text-lg ${formErrors.event_id ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">-- Seleccione un evento para gestionar su horario --</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              {formErrors.event_id && (
                <p className="text-red-500 text-sm mt-1">{formErrors.event_id}</p>
              )}
            </div>

            {/* Solo mostrar el resto del formulario si hay un evento seleccionado */}
            {schedule.event_id && (
              <>
                {/* Rangos de Horas */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-lg font-medium text-gray-700">
                      Rangos de Horas *
                    </label>
                    <button
                      type="button"
                      onClick={addTimeRange}
                      className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 flex items-center gap-2 text-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Añadir Rango
                    </button>
                  </div>

                  {formErrors.time_ranges && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{formErrors.time_ranges}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {schedule.time_ranges.map((range, rangeIndex) => (
                      <div key={range.id} className="p-4 border border-gray-200 rounded-lg bg-indigo-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700">
                            Rango #{rangeIndex + 1}
                          </h4>
                          {schedule.time_ranges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(range.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora de Inicio *
                            </label>
                            <select
                              value={range.start_time}
                              onChange={(e) => handleTimeRangeChange(range.id, 'start_time', e.target.value)}
                              className="w-full p-2 border bg-white rounded"
                            >
                              {!timeOptions.includes(range.start_time) && (
                                <option value={range.start_time}>{range.start_time}</option>
                              )}
                              {timeOptions.map(time => (
                                <option key={`${range.id}-start-${time}`} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora de Fin *
                            </label>
                            <select
                              value={range.end_time}
                              onChange={(e) => handleTimeRangeChange(range.id, 'end_time', e.target.value)}
                              className="w-full p-2 border bg-white rounded"
                            >
                              {!timeOptions.includes(range.end_time) && (
                                <option value={range.end_time}>{range.end_time}</option>
                              )}
                              {timeOptions.map(time => (
                                <option key={`${range.id}-end-${time}`} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-500">
                          Duración: {calculateDuration(range.start_time, range.end_time)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkbox de asignación */}
                <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-6">
                  <input
                    type="checkbox"
                    id="is_assigned_main"
                    checked={schedule.is_assigned}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_assigned_main" className="ml-3 text-lg text-gray-700 font-medium">
                    Asignado (Publicar horario para este evento)
                  </label>
                </div>

                {/* Botones CRUD */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCreateSchedule}
                    disabled={!!schedule.backendId}
                    className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg font-medium ${schedule.backendId
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Nuevo
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateSchedule}
                    disabled={!schedule.backendId}
                    className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg font-medium ${!schedule.backendId
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Guardar Cambios
                  </button>
                </div>
              </>
            )}

            {!schedule.event_id && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-gray-600">Seleccione un evento arriba para comenzar a gestionar sus horarios.</p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen del Evento */}
        {schedule.event_id && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Estado del Horario
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 text-sm">Estado en Servidor</p>
                <p className={`text-xl font-bold ${schedule.backendId ? 'text-green-600' : 'text-amber-600'}`}>
                  {schedule.backendId ? 'Sincronizado' : 'No creado'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 text-sm">Rangos definidos</p>
                <p className="text-xl font-bold text-indigo-600">
                  {schedule.time_ranges.length} bloque(s)
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 text-sm">Visibilidad</p>
                <p className={`text-xl font-bold ${schedule.is_assigned ? 'text-blue-600' : 'text-gray-400'}`}>
                  {schedule.is_assigned ? 'Publicado' : 'Borrador'}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ScheduleForm;