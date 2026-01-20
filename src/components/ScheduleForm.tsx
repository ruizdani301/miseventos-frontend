import React, { useState } from 'react';
import {sendSchedule} from "../services/scheduleService"


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

type ScheduleFormErrors = {
  event_id?: string;
  time_ranges?: string;
};

// Mock de datos
const mockEvents = [
  { id: '1', title: 'Conferencia Anual de Liderazgo' },
  { id: '2', title: 'Workshop de Innovación' },
  { id: '3', title: 'Reunión de Accionistas' },
];

const mockExistingSchedules: ScheduleData[] = [
  {
    id: 'schedule-1',
    backendId: 'backend-schedule-1',
    event_id: '1',
    time_ranges: [
      { id: 'range-1', start_time: '09:00', end_time: '10:30' },
      { id: 'range-2', start_time: '11:00', end_time: '12:30' },
    ],
    is_assigned: true,
    isDirty: false,
  },
  {
    id: 'schedule-2',
    backendId: 'backend-schedule-2',
    event_id: '2',
    time_ranges: [
      { id: 'range-3', start_time: '14:00', end_time: '15:30' },
    ],
    is_assigned: false,
    isDirty: false,
  },
];

const ScheduleForm: React.FC = () => {
  // Estado inicial
  const [schedules, setSchedules] = useState<ScheduleData[]>(mockExistingSchedules);
  const [errors, setErrors] = useState<Record<string, ScheduleFormErrors>>({});

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
  const createNewEmptySchedule = (): ScheduleData => {
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
  };

  // Agregar nuevo horario
  const addNewSchedule = () => {
    const newSchedule = createNewEmptySchedule();
    setSchedules(prev => [...prev, newSchedule]);
  };

  // Eliminar horario de la vista
  const removeSchedule = (scheduleId: string) => {
    if (schedules.length > 1) {
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      
      if (errors[scheduleId]) {
        const newErrors = { ...errors };
        delete newErrors[scheduleId];
        setErrors(newErrors);
      }
    }
  };

  // Manejar cambio de evento
  const handleEventChange = (scheduleId: string, value: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, event_id: value, isDirty: true }
        : schedule
    ));

    if (errors[scheduleId]?.event_id) {
      setErrors(prev => ({
        ...prev,
        [scheduleId]: { ...prev[scheduleId], event_id: undefined }
      }));
    }
  };

  // Manejar cambio de checkbox
  const handleCheckboxChange = (scheduleId: string, checked: boolean) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, is_assigned: checked, isDirty: true }
        : schedule
    ));
  };

  // Agregar nuevo rango de horas a un horario específico
  const addTimeRange = (scheduleId: string) => {
    const newTimeRange: TimeRange = {
      id: Date.now().toString(),
      start_time: '09:00',
      end_time: '17:00',
    };
    
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { 
            ...schedule, 
            time_ranges: [...schedule.time_ranges, newTimeRange],
            isDirty: true
          }
        : schedule
    ));
  };

  // Eliminar un rango de horas
  const removeTimeRange = (scheduleId: string, rangeId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { 
            ...schedule, 
            time_ranges: schedule.time_ranges.length > 1 
              ? schedule.time_ranges.filter(range => range.id !== rangeId)
              : schedule.time_ranges,
            isDirty: true
          }
        : schedule
    ));
  };

  // Manejar cambio en un rango de horas
  const handleTimeRangeChange = (
    scheduleId: string, 
    rangeId: string, 
    field: 'start_time' | 'end_time', 
    value: string
  ) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? {
            ...schedule,
            time_ranges: schedule.time_ranges.map(range =>
              range.id === rangeId 
                ? { ...range, [field]: value }
                : range
            ),
            isDirty: true
          }
        : schedule
    ));
  };

  // Calcular duración de un rango
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

    // Validar rangos de horas
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
const createSchedule = async (scheduleId: string) => {
  const schedule = schedules.find(s => s.id === scheduleId);
  if (!schedule) return;

  const scheduleErrors = validateSchedule(schedule);

  if (Object.keys(scheduleErrors).length > 0) {
    setErrors(prev => ({ ...prev, [scheduleId]: scheduleErrors }));
    alert('Corrija los errores antes de crear');
    return;
  }

  const payload = {
    event_id: schedule.event_id,
    time_slots: schedule.time_ranges.map(range => ({
      start_time: range.start_time,
      end_time: range.end_time,
    })),
    is_assigned: schedule.is_assigned,
  };

  try {
    //llamada al backend
    const response = await sendSchedule(payload);

    console.log("Backend response:", response);

    const backendId = response.id ?? `backend-schedule-${Date.now()}`;

    setSchedules(prev =>
      prev.map(s =>
        s.id === scheduleId
          ? { ...s, backendId, isDirty: false }
          : s
      )
    );

    alert('Horario creado exitosamente en el backend');
  } catch (error) {
    console.error(error);
    alert('Error al crear el horario');
  }
};


  // Actualizar horario (PUT al backend)
  const updateSchedule = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule || !schedule.backendId) {
      alert('Este horario no existe en el backend. Use "Crear" primero.');
      return;
    }

    const scheduleErrors = validateSchedule(schedule);
    
    if (Object.keys(scheduleErrors).length > 0) {
      setErrors(prev => ({ ...prev, [scheduleId]: scheduleErrors }));
      alert('Corrija los errores antes de actualizar');
      return;
    }

    // Simulación de llamada al backend
    console.log(`PUT /api/schedules/${schedule.backendId} - Actualizando horario:`, {
      id: schedule.backendId,
      event_id: schedule.event_id,
      time_slots: schedule.time_ranges.map(range => ({
        start_time: range.start_time,
        end_time: range.end_time
      })),
      is_assigned: schedule.is_assigned
    });
    
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId 
        ? { ...s, isDirty: false }
        : s
    ));
    
    alert('Horario actualizado exitosamente');
  };

  // Eliminar horario del backend (DELETE)
  const deleteSchedule = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    if (!schedule.backendId) {
      removeSchedule(scheduleId);
      alert('Borrador de horario eliminado');
      return;
    }

    // Simulación de llamada al backend
    console.log(`DELETE /api/schedules/${schedule.backendId} - Eliminando horario`);
    
    removeSchedule(scheduleId);
    alert('Horario eliminado del backend y de la vista');
  };

  // Limpiar horario
  const clearSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? createNewEmptySchedule()
        : schedule
    ));

    if (errors[scheduleId]) {
      const newErrors = { ...errors };
      delete newErrors[scheduleId];
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-blue-800">Gestión de Horarios</h2>
            <p className="text-gray-600 text-sm mt-1">CRUD independiente para cada horario</p>
          </div>
          <button
            type="button"
            onClick={addNewSchedule}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Horario
          </button>
        </div>

        {/* Lista de horarios */}
        <div className="space-y-8">
          {schedules.map((schedule, index) => (
            <div 
              key={schedule.id} 
              className={`p-6 border-2 rounded-lg bg-white shadow-sm ${
                schedule.isDirty ? 'border-yellow-300' : 'border-indigo-100'
              }`}
            >
              {/* Header del horario */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Horario #{index + 1}
                  </h3>
                  {schedule.backendId && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Guardado
                    </span>
                  )}
                  {schedule.isDirty && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Cambios sin guardar
                    </span>
                  )}
                </div>
                
                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(schedule.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Quitar horario de la vista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Selector de Evento */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Seleccionar Evento *
                </label>
                <select
                  value={schedule.event_id}
                  onChange={(e) => handleEventChange(schedule.id, e.target.value)}
                  className={`w-full p-3 border bg-indigo-100 rounded-lg text-lg ${
                    errors[schedule.id]?.event_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Seleccione un evento --</option>
                  {mockEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                {errors[schedule.id]?.event_id && (
                  <p className="text-red-500 text-sm mt-1">{errors[schedule.id]?.event_id}</p>
                )}
              </div>

              {/* Rangos de Horas */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Rangos de Horas *
                  </label>
                  <button
                    type="button"
                    onClick={() => addTimeRange(schedule.id)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 flex items-center gap-2 text-sm"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Añadir Rango
                  </button>
                </div>

                {errors[schedule.id]?.time_ranges && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errors[schedule.id]?.time_ranges}</p>
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
                            onClick={() => removeTimeRange(schedule.id, range.id)}
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
                            onChange={(e) => handleTimeRangeChange(schedule.id, range.id, 'start_time', e.target.value)}
                            className="w-full p-2 border bg-white rounded"
                          >
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
                            onChange={(e) => handleTimeRangeChange(schedule.id, range.id, 'end_time', e.target.value)}
                            className="w-full p-2 border bg-white rounded"
                          >
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
                  id={`is_assigned_${schedule.id}`}
                  checked={schedule.is_assigned}
                  onChange={(e) => handleCheckboxChange(schedule.id, e.target.checked)}
                  className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor={`is_assigned_${schedule.id}`} className="ml-3 text-lg text-gray-700 font-medium">
                  Asignado
                </label>
              </div>

              {/* Botones CRUD */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => createSchedule(schedule.id)}
                  disabled={!!schedule.backendId}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    schedule.backendId 
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
                  onClick={() => updateSchedule(schedule.id)}
                  disabled={!schedule.backendId || !schedule.isDirty}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    !schedule.backendId || !schedule.isDirty
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
                  onClick={() => deleteSchedule(schedule.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>

                <button
                  type="button"
                  onClick={() => clearSchedule(schedule.id)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpiar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">{schedules.length}</p>
              <p className="text-sm text-blue-600">Horarios en vista</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">
                {schedules.filter(s => s.backendId).length}
              </p>
              <p className="text-sm text-green-600">Guardados en backend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-700">
                {schedules.reduce((total, schedule) => total + schedule.time_ranges.length, 0)}
              </p>
              <p className="text-sm text-yellow-600">Rangos de horas totales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;