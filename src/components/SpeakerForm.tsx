import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CreateSubmit from './buttons/CreateSubmit';
import ResetFormat from './buttons/ResetFormat';

// Definir tipos para este formulario
type ProfileFormData = {
  full_name: string;
  email: string;
  bio: string;
};

type ProfileFormErrors = {
  full_name?: string;
  email?: string;
  bio?: string;
};

const SpeakerForm: React.FC = () => {
  // Estado inicial
  const initialFormData: ProfileFormData = {
    full_name: '',
    email: '',
    bio: '',
  };

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  // Manejar cambios
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name as keyof ProfileFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};

    // Validar nombre completo
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'El nombre completo es requerido';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'El nombre debe tener al menos 2 caracteres';
    }

  // Validar email (ahora REQUERIDO)
  if (!formData.email.trim()) {
    newErrors.email = 'El email es requerido';
  } else if (!isValidEmail(formData.email)) {
    newErrors.email = 'Por favor ingrese un email válido';
  }

  // Validar bio (ahora REQUERIDO con mínimo 10 caracteres)
  if (!formData.bio.trim()) {
    newErrors.bio = 'La biografía es requerida';
  } else if (formData.bio.trim().length < 10) {
    newErrors.bio = 'La biografía debe tener al menos 10 caracteres';
  } else if (formData.bio.trim().length > 500) {
    newErrors.bio = 'La biografía no puede exceder los 500 caracteres';
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
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),  // Enviar null si está vacío
        bio: formData.bio.trim(),      // Enviar null si está vacío
      };

      console.log('Datos para perfil:', dataToSend);
      alert('Formulario de perfil válido. Aquí llamarías a tu API.');
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
        <h2 className="text-xl font-bold text-blue-800 mb-4">Crear Los Ponentes del Evento</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre Completo */}
          <div>
            <label className="block text-2xl font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez González"
              className={`w-full p-3 border bg-indigo-100 rounded-lg text-lg ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Ingrese nombre del ponente
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan.perez@empresa.com"
              className={`w-full p-3 border bg-indigo-100 rounded-lg ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Biografía
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción profesional, intereses, experiencia..."
              className={`w-full p-3 border bg-indigo-100 rounded-lg ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
            <div className="flex justify-between items-center mt-1">
             
              <p className={`text-xs ${
                formData.bio.length > 500 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {formData.bio.length}/500 caracteres
              </p>
            </div>
          </div>

          {/* Información sobre campos opcionales */}
          {/* <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Los campos email y biografía son opcionales en el backend. 
                  Si se dejan vacíos en el formulario, se enviarán como <code className="bg-blue-100 px-1">null</code>.
                </p>
              </div>
            </div>
          </div> */}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <CreateSubmit name="Crear ponentes" />
            <ResetFormat name="Limpiar Formulario" onClick={resetForm} />
          </div>
        </form>

        {/* Vista previa de datos */}
        {/* <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium text-gray-700 mb-2">Datos a enviar al backend:</h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
            {JSON.stringify({
              full_name: formData.full_name,
              email: formData.email || null,
              bio: formData.bio || null,
            }, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
};

export default SpeakerForm;