import React, { useState } from 'react';
import type { ChangeEvent, FormEvent} from 'react';
import CreateSubmit from './buttons/CreateSubmit';
import ResetFormat from './buttons/ResetFormat';
import type {FormErrors, FormData } from '../types/index';
const CreatedEvent: React.FC = () => {
  // Definir tipos
  //type EventStatus = 'published' | 'closed';
  // type FormData = {
  //   title: string;
  //   description: string;
  //   start_date: string;
  //   end_date: string;
  //   capacity: string;
  //   status: EventStatus;
  // };

  // type FormErrors = {
  //   title?: string;
  //   description?: string;
  //   start_date?: string;
  //   end_date?: string;
  //   capacity?: string;
  // };

  // Estado inicial
  const initialFormData: FormData = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    capacity: '',
    status: 'published',
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  // Manejar cambios
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Título requerido';
    if (!formData.description.trim()) newErrors.description = 'Descripción requerida';
    if (!formData.start_date) newErrors.start_date = 'Fecha inicio requerida';
    if (!formData.end_date) newErrors.end_date = 'Fecha fin requerida';
    if (formData.start_date && formData.end_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = 'La fecha fin debe ser posterior a la fecha inicio';
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacidad debe ser mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí puedes llamar a tu función para enviar al backend
      console.log('Datos listos para enviar:', {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        capacity: parseInt(formData.capacity),
        status: formData.status
      });
      
      alert('Formulario válido. Aquí llamarías a tu API.');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // Formatear fecha para datetime-local
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Crear Evento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-2xl font-medium text-gray-700 mb-1">
              Título del evento *
            </label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border  bg-indigo-100 rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Título del evento"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full  bg-indigo-100 p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Descripción del evento"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio *
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formatDate(formData.start_date)}
                onChange={handleChange}
                className={`w-full  bg-indigo-100 p-2 border rounded ${errors.start_date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
            </div>

            {/* Fecha fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin *
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formatDate(formData.end_date)}
                onChange={handleChange}
                className={`w-full  bg-indigo-100 p-2 border rounded ${errors.end_date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {/* Capacidad y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Capacidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className={`w-full  bg-indigo-100 p-2 border rounded ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Número de asistentes"
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full  bg-indigo-100 p-2 border border-gray-300 rounded"
              >
                <option value="published">PUBLISHED</option>
                <option value="closed">CLOSED</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Se enviará como: "{formData.status}"
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <CreateSubmit
            name='Crear Evento'/>
            <ResetFormat
            name="Limpiar"
            onClick={resetForm}/>
          </div>
        </form>

        
      </div>
    </div>
  );
};

export default CreatedEvent;