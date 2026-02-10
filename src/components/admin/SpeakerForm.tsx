import React, { useState, useEffect } from 'react';

import { sendSpeaker, getSpeakersAll, deleteSpeakerService, updatepeakerService } from '../../services/speakerService';

// Definir tipos
type SpeakerData = {
  id: string; // ID interno para la vista
  backendId?: string; // ID asignado por el backend
  full_name: string;
  email: string;
  bio: string;
  isDirty?: boolean;
};

type SpeakerFormErrors = {
  full_name?: string;
  email?: string;
  bio?: string;
};


const SpeakerForm: React.FC = () => {
  // Estado inicial
  const [speakers, setSpeakers] = useState<SpeakerData[]>([]);
  const [errors, setErrors] = useState<Record<string, SpeakerFormErrors>>({});
  const [reloadSpeakers, setReloadSpeakers] = useState(0);

  useEffect(() => {
    const loadSpeaker = async () => {
      try {
        const response = await getSpeakersAll();

        const mappedSpeaker: SpeakerData[] = response.speaker.map((speaker) => ({
          id: speaker.id,
          backendId: speaker.id,
          full_name: speaker.full_name,
          email: speaker.email,
          bio: speaker.bio,
          isDirty: false,
        }));

        setSpeakers(mappedSpeaker);
      } catch (err) {
        console.error(err);
      }
    };

    loadSpeaker();
  }, [reloadSpeakers]);


  // Crear nuevo speaker vacío
  const createNewEmptySpeaker = (): SpeakerData => ({
    id: Date.now().toString(),
    full_name: '',
    email: '',
    bio: '',
    isDirty: false,
  });

  // Agregar nuevo speaker
  const addNewSpeaker = () => {
    const newSpeaker = createNewEmptySpeaker();
    setSpeakers(prev => [...prev, newSpeaker]);
  };

  // Eliminar speaker de la vista
  const removeSpeaker = (speakerId: string) => {
    if (speakers.length > 1) {
      setSpeakers(prev => prev.filter(speaker => speaker.id !== speakerId));

      if (errors[speakerId]) {
        const newErrors = { ...errors };
        delete newErrors[speakerId];
        setErrors(newErrors);
      }
    }
  };

  // Manejar cambios en un speaker específico
  const handleSpeakerChange = (speakerId: string, field: keyof SpeakerData, value: string) => {
    setSpeakers(prev => prev.map(speaker =>
      speaker.id === speakerId
        ? { ...speaker, [field]: value, isDirty: true }
        : speaker
    ));

    // Solo limpiar errores para campos que tienen validación
    if (field === 'full_name' || field === 'email' || field === 'bio') {
      if (errors[speakerId]?.[field as keyof SpeakerFormErrors]) {
        setErrors(prev => ({
          ...prev,
          [speakerId]: {
            ...prev[speakerId],
            [field]: undefined
          }
        }));
      }
    }
  };

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar un speaker específico
  const validateSpeaker = (speaker: SpeakerData): SpeakerFormErrors => {
    const speakerErrors: SpeakerFormErrors = {};

    // Validar nombre completo
    if (!speaker.full_name.trim()) {
      speakerErrors.full_name = 'El nombre completo es requerido';
    } else if (speaker.full_name.trim().length < 2) {
      speakerErrors.full_name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!speaker.email.trim()) {
      speakerErrors.email = 'El email es requerido';
    } else if (!isValidEmail(speaker.email)) {
      speakerErrors.email = 'Por favor ingrese un email válido';
    }

    // Validar bio
    if (!speaker.bio.trim()) {
      speakerErrors.bio = 'La biografía es requerida';
    } else if (speaker.bio.trim().length < 10) {
      speakerErrors.bio = 'La biografía debe tener al menos 10 caracteres';
    } else if (speaker.bio.trim().length > 500) {
      speakerErrors.bio = 'La biografía no puede exceder los 500 caracteres';
    }

    return speakerErrors;
  };

  // Crear speaker (POST al backend)
  const createSpeaker = async (speakerId: string) => {
    const speaker = speakers.find(s => s.id === speakerId);
    if (!speaker) return;

    const speakerErrors = validateSpeaker(speaker);

    if (Object.keys(speakerErrors).length > 0) {
      setErrors(prev => ({ ...prev, [speakerId]: speakerErrors }));
      alert('Corrija los errores antes de crear');
      return;
    }

    // Simulación de llamada al backend

    const payload = {
      full_name: speaker.full_name.trim(),
      email: speaker.email.trim(),
      bio: speaker.bio.trim(),
    }

    try {

      const response = await sendSpeaker(payload);
      console.log("Backen response", response)


      const backendId = `backend-speaker-${Date.now()}`;

      setSpeakers(prev => prev.map(s =>
        s.id === speakerId
          ? { ...s, backendId, isDirty: false }
          : s
      ));

      console.log(`Speaker "${speaker.full_name}" creado exitosamente`);
    } catch (error) {
      console.error(error)
    }
  };

  // Actualizar speaker (PUT al backend)
  const updateSpeaker = async (speakerId: string) => {
    const speaker = speakers.find(s => s.id === speakerId);
    if (!speaker || !speaker.backendId) {
      alert('Este speaker no existe en el backend. Use "Crear" primero.');
      return;
    }

    const speakerErrors = validateSpeaker(speaker);

    if (Object.keys(speakerErrors).length > 0) {
      setErrors(prev => ({ ...prev, [speakerId]: speakerErrors }));
      alert('Corrija los errores antes de actualizar');
      return;
    }

    // Simulación de llamada al backend
    const payload = {
      id: speaker.backendId,
      full_name: speaker.full_name.trim(),
      email: speaker.email.trim(),
      bio: speaker.bio.trim(),
    };
    try {

      const response = await updatepeakerService(payload);
      console.log("Backen response", response)
      setReloadSpeakers(prev => prev + 1);


      //const backendId = `backend-speaker-${Date.now()}`;

      //   setSpeakers(prev => prev.map(s => 
      //   s.id === speakerId 
      //     ? { ...s, backendId, isDirty: false }
      //     : s
      // ));

      console.log(`Speaker "${speaker.full_name}" actualizado exitosamente`);
    } catch (error) {
      console.error(error)
    }
  };


  // Eliminar speaker del backend (DELETE)
  const deleteSpeaker = async (speakerId: string) => {
    const speaker = speakers.find(s => s.id === speakerId);
    if (!speaker) return;

    if (!speaker.backendId) {
      removeSpeaker(speakerId);
      // alert('Borrador de speaker eliminado');
      return;
    }
    try {

      // Simulación de llamada al backend
      const response = await deleteSpeakerService(speaker.backendId);
      if (!response.success) {
        console.log("No se pudo eliminar el speaker")
        return
      }
      console.log(`Speaker "${speaker.full_name}" eliminado del backend`);
      setReloadSpeakers(prev => prev + 1);

    } catch (error) {
      console.log(error);

    }
  };


  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={addNewSpeaker}
            className="bg-[#9ACD32] text-black-200 px-4 py-2 rounded-lg hover:bg-[#9ACD32] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Ponente
          </button>
        </div>

        {/* Lista de speakers */}
        <div className="space-y-8">
          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className={`p-6 border-2 rounded-lg bg-white shadow-sm ${speaker.isDirty ? 'border-yellow-300' : 'border-indigo-100'
                }`}
            >
              {/* Header del speaker */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ponente #{index + 1}
                  </h3>
                  {speaker.backendId && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Guardado
                    </span>
                  )}
                  {speaker.isDirty && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Cambios sin guardar
                    </span>
                  )}
                </div>

                {speakers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpeaker(speaker.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Quitar ponente de la vista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Campos del speaker - Diseño responsive */}
              <div className="space-y-6">
                {/* Nombre Completo */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={speaker.full_name}
                    onChange={(e) => handleSpeakerChange(speaker.id, 'full_name', e.target.value)}
                    placeholder="Ej: Juan Pérez González"
                    className={`w-full p-3 border bg-indigo-100 rounded-lg ${errors[speaker.id]?.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors[speaker.id]?.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors[speaker.id]?.full_name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={speaker.email}
                    onChange={(e) => handleSpeakerChange(speaker.id, 'email', e.target.value)}
                    placeholder="Ej: juan.perez@empresa.com"
                    className={`w-full p-3 border bg-indigo-100 rounded-lg ${errors[speaker.id]?.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors[speaker.id]?.email && (
                    <p className="text-red-500 text-sm mt-1">{errors[speaker.id]?.email}</p>
                  )}
                </div>

                {/* Biografía */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Biografía *
                  </label>
                  <textarea
                    value={speaker.bio}
                    onChange={(e) => handleSpeakerChange(speaker.id, 'bio', e.target.value)}
                    rows={4}
                    placeholder="Descripción profesional, experiencia, especialización..."
                    className={`w-full p-3 border bg-indigo-100 rounded-lg ${errors[speaker.id]?.bio ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors[speaker.id]?.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors[speaker.id]?.bio}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Mínimo 10 caracteres, máximo 500
                    </p>
                    <p className={`text-xs ${speaker.bio.length < 10 ? 'text-red-500' :
                      speaker.bio.length > 500 ? 'text-red-500' : 'text-green-500'
                      }`}>
                      {speaker.bio.length}/500 caracteres
                      {speaker.bio.length < 10 && ` (faltan ${10 - speaker.bio.length})`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones CRUD */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => createSpeaker(speaker.id)}
                  disabled={!!speaker.backendId}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${speaker.backendId
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
                  onClick={() => updateSpeaker(speaker.id)}
                  disabled={!speaker.backendId || !speaker.isDirty}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${!speaker.backendId || !speaker.isDirty
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
                  onClick={() => deleteSpeaker(speaker.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>

              </div>

              {/* Información del speaker */}
              {speaker.backendId && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <p className="mt-1">Email: <span className="font-medium">{speaker.email}</span></p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">{speakers.length}</p>
              <p className="text-sm text-blue-600">Ponentes en vista</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">
                {speakers.filter(s => s.backendId).length}
              </p>
              <p className="text-sm text-green-600">Guardados en backend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-700">
                {speakers.filter(s => s.isDirty).length}
              </p>
              <p className="text-sm text-yellow-600">Con cambios sin guardar</p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-indigo-700">
                <strong>Requisitos:</strong> Todos los campos son obligatorios. La biografía debe tener entre 10 y 500 caracteres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerForm;