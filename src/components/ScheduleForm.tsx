import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CreateSubmit from './buttons/CreateSubmit';
import ResetFormat from './buttons/ResetFormat';

// Definir tipos
type TimeRange = {
  id: string; // Para identificar cada rango
  start_time: string;
  end_time: string;
};

type ScheduleFormData = {
  event_id: string;
  time_ranges: TimeRange[]; // Lista de rangos de horas
  is_assigned: boolean;
};

type ScheduleFormErrors = {
  event_id?: string;
  time_ranges?: string;
  global?: string;
};

// Mock de eventos temporal solo de muestra, pendiente traer de la api
const mockEvents = [
  { id: '1', title: 'Conferencia Anual de Liderazgo' },
  { id: '2', title: 'Workshop de Innovación' },
  { id: '3', title: 'Reunión de Accionistas' },
];

const ScheduleForm: React.FC = () => {
  // Estado inicial con un rango vacío
  const initialTimeRange: TimeRange = {
    id: Date.now().toString(),
    start_time: '09:00',
    end_time: '17:00',
  };

  const initialFormData: ScheduleFormData = {
    event_id: '',
    time_ranges: [initialTimeRange],
    is_assigned: false,
  };

  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [errors, setErrors] = useState<ScheduleFormErrors>({});
  const [events, setEvents] = useState(mockEvents);

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

  // Manejar cambios en el evento principal
  const handleEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      event_id: value
    }));
    
    if (errors.event_id) {
      setErrors(prev => ({ ...prev, event_id: undefined }));
    }
  };

  // Manejar cambios en un rango de horas específico
  const handleTimeRangeChange = (id: string, field: 'start_time' | 'end_time', value: string) => {
    setFormData(prev => ({
      ...prev,
      time_ranges: prev.time_ranges.map(range => 
        range.id === id ? { ...range, [field]: value } : range
      )
    }));
  };

  // Agregar nuevo rango de horas
  const addTimeRange = () => {
    const newTimeRange: TimeRange = {
      id: Date.now().toString(),
      start_time: '09:00',
      end_time: '17:00',
    };
    
    setFormData(prev => ({
      ...prev,
      time_ranges: [...prev.time_ranges, newTimeRange]
    }));
  };

  // Eliminar un rango de horas
  const removeTimeRange = (id: string) => {
    if (formData.time_ranges.length > 1) {
      setFormData(prev => ({
        ...prev,
        time_ranges: prev.time_ranges.filter(range => range.id !== id)
      }));
    }
  };

  // Manejar checkbox
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      is_assigned: checked
    }));
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: ScheduleFormErrors = {};
    
    // Validar evento
    if (!formData.event_id.trim()) {
      newErrors.event_id = 'Seleccione un evento';
    }
    
    // Validar rangos de horas
    const hasInvalidTimeRange = formData.time_ranges.some(range => {
      const [startHour, startMinute] = range.start_time.split(':').map(Number);
      const [endHour, endMinute] = range.end_time.split(':').map(Number);
      
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      
      return endTotal <= startTotal;
    });
    
    if (hasInvalidTimeRange) {
      newErrors.time_ranges = 'Algunos rangos de horas tienen fin antes o igual al inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Preparar datos para enviar al backend
      const dataToSend = {
        event_id: formData.event_id,
        time_slots: formData.time_ranges.map(range => ({
          start_time: range.start_time,
          end_time: range.end_time
        })),
        is_assigned: formData.is_assigned
      };
      
      console.log('Datos para schedule:', dataToSend);
      alert('Formulario de horario válido. Aquí llamarías a tu API.');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Crear Horarios Para el Evento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Evento (Select) */}
          <div>
            <label className="block text-2xl font-medium text-gray-700 mb-2">
              Seleccionar Evento *
            </label>
            <select
              name="event_id"
              value={formData.event_id}
              onChange={handleEventChange}
              className={`w-full p-3 border bg-indigo-100 rounded-lg text-lg ${
                errors.event_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Seleccione un evento --</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            {errors.event_id && (
              <p className="text-red-500 text-sm mt-1">{errors.event_id}</p>
            )}
          </div>

          {/* Lista de rangos de horas */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Rangos de Horas *
              </label>
              <button
                type="button"
                onClick={addTimeRange}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Añadir Horario
              </button>
            </div>

            {errors.time_ranges && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{errors.time_ranges}</p>
              </div>
            )}

            {formData.time_ranges.map((range, index) => (
              <div key={range.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Horario #{index + 1}
                  </h3>
                  {formData.time_ranges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeRange(range.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hora de inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Inicio *
                    </label>
                    <select
                      value={range.start_time}
                      onChange={(e) => handleTimeRangeChange(range.id, 'start_time', e.target.value)}
                      className="w-full p-3 border bg-indigo-50 rounded-lg"
                    >
                      {timeOptions.map(time => (
                        <option key={`${range.id}-start-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hora de fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Fin *
                    </label>
                    <select
                      value={range.end_time}
                      onChange={(e) => handleTimeRangeChange(range.id, 'end_time', e.target.value)}
                      className="w-full p-3 border bg-indigo-50 rounded-lg"
                    >
                      {timeOptions.map(time => (
                        <option key={`${range.id}-end-${time}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mostrar duración del rango */}
                <div className="mt-3 text-sm text-gray-500">
                  Duración: {
                    (() => {
                      const [startHour, startMinute] = range.start_time.split(':').map(Number);
                      const [endHour, endMinute] = range.end_time.split(':').map(Number);
                      const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                      const hours = Math.floor(durationMinutes / 60);
                      const minutes = durationMinutes % 60;
                      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
                    })()
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox para asignación */}
          <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <input
              type="checkbox"
              id="is_assigned"
              name="is_assigned"
              checked={formData.is_assigned}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="is_assigned" className="ml-3 text-lg text-gray-700 font-medium">
              Seleccione para asignar
            </label>
            
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <CreateSubmit name="Crear Horarios" />
            <ResetFormat name="Limpiar Todo" onClick={resetForm} />
          </div>
        </form>

        {/* Vista previa de datos
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium text-gray-700 mb-2">Datos a enviar:</h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {JSON.stringify({
              event_id: formData.event_id,
              time_slots: formData.time_ranges.map(range => ({
                start_time: range.start_time,
                end_time: range.end_time
              })),
              is_assigned: formData.is_assigned
            }, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
};

export default ScheduleForm;