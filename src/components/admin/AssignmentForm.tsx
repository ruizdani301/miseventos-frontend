import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CreateSubmit from './buttons/CreateSubmit';
import ResetFormat from './buttons/ResetFormat';

// Definir tipos
type AssignmentData = {
  id: string; // Para identificación interna
  session_id: string;
  speaker_id: string;
};

type AssignmentFormErrors = {
  global?: string;
  assignments?: Record<string, {
    session_id?: string;
    speaker_id?: string;
    global ?:string;
  }>;
};

// Mock de datos (reemplazar con llamadas API)
const mockSessions = [
  { id: 'session-1', title: 'Sesión de Apertura', time: '09:00-10:30' },
  { id: 'session-2', title: 'Workshop Práctico', time: '11:00-12:30' },
  { id: 'session-3', title: 'Panel de Discusión', time: '14:00-15:30' },
  { id: 'session-4', title: 'Cierre y Conclusiones', time: '16:00-17:30' },
];

const mockSpeakers = [
  { id: 'speaker-1', name: 'María González', position: 'CEO' },
  { id: 'speaker-2', name: 'Carlos Rodríguez', position: 'CTO' },
  { id: 'speaker-3', name: 'Ana Martínez', position: 'Head of Marketing' },
  { id: 'speaker-4', name: 'Luis Fernández', position: 'Senior Developer' },
  { id: 'speaker-5', name: 'Sofía Ramírez', position: 'Product Manager' },
];

const AssignmentForm: React.FC = () => {
  // Estado inicial con una asignación vacía
  const initialAssignment: AssignmentData = {
    id: Date.now().toString(),
    session_id: '',
    speaker_id: '',
  };

  const [assignments, setAssignments] = useState<AssignmentData[]>([initialAssignment]);
  const [errors, setErrors] = useState<AssignmentFormErrors>({});

  // En producción, aquí harías fetch de datos
  useEffect(() => {
    // Ejemplo: fetchSessions().then(setSessions);
    // Ejemplo: fetchSpeakers().then(setSpeakers);
  }, []);

  // Manejar cambios en una asignación específica
  const handleAssignmentChange = (assignmentId: string, field: keyof AssignmentData, value: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, [field]: value }
        : assignment
    ));

    // Limpiar errores del campo modificado
    if (errors.assignments?.[assignmentId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        assignments: {
          ...prev.assignments,
          [assignmentId]: {
            ...prev.assignments?.[assignmentId],
            [field]: undefined
          }
        }
      }));
    }
  };

  // Agregar nueva asignación
  const addNewAssignment = () => {
    const newAssignment: AssignmentData = {
      id: Date.now().toString(),
      session_id: '',
      speaker_id: '',
    };
    
    setAssignments(prev => [...prev, newAssignment]);
  };

  // Eliminar una asignación
  const removeAssignment = (assignmentId: string) => {
    if (assignments.length > 1) {
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      
      // Limpiar errores de la asignación eliminada
      if (errors.assignments?.[assignmentId]) {
        setErrors(prev => {
          const newAssignments = { ...prev.assignments };
          delete newAssignments[assignmentId];
          return { ...prev, assignments: newAssignments };
        });
      }
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const assignmentErrors: Record<string, any> = {};
    let hasErrors = false;

    assignments.forEach((assignment) => {
      const assignmentError: any = {};

      // Validar sesión
      if (!assignment.session_id) {
        assignmentError.session_id = 'Seleccione una sesión';
        hasErrors = true;
      }

      // Validar speaker
      if (!assignment.speaker_id) {
        assignmentError.speaker_id = 'Seleccione un speaker';
        hasErrors = true;
      }

      // Validar combinación única (opcional, si quieres evitar duplicados)
      const duplicate = assignments.filter(a => 
        a.session_id === assignment.session_id && 
        a.speaker_id === assignment.speaker_id
      ).length > 1;
      
      if (duplicate && assignment.session_id && assignment.speaker_id) {
        assignmentError.global = 'Esta combinación ya está asignada';
        hasErrors = true;
      }

      if (Object.keys(assignmentError).length > 0) {
        assignmentErrors[assignment.id] = assignmentError;
      }
    });

    setErrors({ assignments: assignmentErrors });
    return !hasErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      // Preparar datos para enviar al backend
      const dataToSend = assignments.map(assignment => ({
        session_id: assignment.session_id,
        speaker_id: assignment.speaker_id,
      }));

      console.log('Asignaciones a enviar:', dataToSend);
      
      // Aquí iría tu llamada a la API
      // fetch('/api/assignments/bulk', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ assignments: dataToSend })
      // })
      
      alert(`${assignments.length} asignación(es) lista(s) para enviar.`);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setAssignments([initialAssignment]);
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-800">Asignar Speakers a Sesiones</h2>
          <button
            type="button"
            onClick={addNewAssignment}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Añadir Asignación
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="p-5 border-2 border-indigo-100 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Asignación #{index + 1}
                </h3>
                {assignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAssignment(assignment.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Eliminar asignación"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Campos en grid horizontal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Session ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sesión *
                  </label>
                  <select
                    value={assignment.session_id}
                    onChange={(e) => handleAssignmentChange(assignment.id, 'session_id', e.target.value)}
                    className={`w-full p-3 border bg-indigo-50 rounded-lg ${errors.assignments?.[assignment.id]?.session_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">-- Seleccione una sesión --</option>
                    {mockSessions.map(session => (
                      <option key={session.id} value={session.id}>
                        {session.title} ({session.time})
                      </option>
                    ))}
                  </select>
                  {errors.assignments?.[assignment.id]?.session_id && (
                    <p className="text-red-500 text-xs mt-2">{errors.assignments[assignment.id]?.session_id}</p>
                  )}
                </div>

                {/* Speaker ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker *
                  </label>
                  <select
                    value={assignment.speaker_id}
                    onChange={(e) => handleAssignmentChange(assignment.id, 'speaker_id', e.target.value)}
                    className={`w-full p-3 border bg-indigo-50 rounded-lg ${errors.assignments?.[assignment.id]?.speaker_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">-- Seleccione un speaker --</option>
                    {mockSpeakers.map(speaker => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.name} - {speaker.position}
                      </option>
                    ))}
                  </select>
                  {errors.assignments?.[assignment.id]?.speaker_id && (
                    <p className="text-red-500 text-xs mt-2">{errors.assignments[assignment.id]?.speaker_id}</p>
                  )}
                </div>
              </div>

              {/* Error global para la asignación */}
              {errors.assignments?.[assignment.id]?.global && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-600 text-sm">{errors.assignments[assignment.id]?.global}</p>
                </div>
              )}
            </div>
          ))}

          {/* Botones principales */}
          <div className="flex gap-3 pt-4">
            <CreateSubmit name="Crear Asignaciones" />
            <ResetFormat name="Limpiar Todo" onClick={resetForm} />
          </div>
        </form>

        {/* Información adicional */}
        {/* <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Nota:</strong> Puedes asignar múltiples speakers a múltiples sesiones. 
                Cada asignación crea una relación entre una sesión y un speaker.
              </p>
            </div>
          </div>
        </div> */}

        {/* Vista previa de datos */}
        {/* <div className="mt-8 p-4 bg-gray-50 rounded">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Datos a enviar al backend:</h3>
            <span className="text-sm text-gray-500">
              {assignments.length} asignación(es) configurada(s)
            </span>
          </div>
          <pre className="text-sm text-gray-600 overflow-x-auto max-h-60 overflow-y-auto">
            {JSON.stringify(
              assignments.map(assignment => ({
                session_id: assignment.session_id,
                speaker_id: assignment.speaker_id,
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

export default AssignmentForm;