import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, User, Info, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { getEvents } from '../../services/eventService';
import type { EventItem, SessionRegister } from '../../types';
import Pagination from '../common/Pagination';
import { registerSession, deleteRegisterSession } from '../../services/sessionRegisterService';



// --- Skeleton Component ---
const SkeletonCard = () => (
    <div className="bg-[#A9A9A9]/20 border border-white/10 rounded-2xl p-6 animate-pulse space-y-6">
        <div className="space-y-3">
            <div className="h-8 bg-white/20 rounded-lg w-3/4"></div>
            <div className="h-4 bg-white/10 rounded-lg w-full"></div>
        </div>
        <div className="space-y-4 pt-4 border-t border-white/5">
            {[1, 2].map((i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between">
                        <div className="h-5 bg-white/20 rounded w-1/2"></div>
                        <div className="h-5 bg-white/20 rounded w-1/4"></div>
                    </div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                </div>
            ))}
        </div>
    </div>
);

const EventDiscovery: React.FC = () => {
    const [data, setData] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Map<sessionId, registrationId>
    const [registeredSessions, setRegisteredSessions] = useState<Map<string, string>>(new Map());

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    const fetchEventsData = async (page: number) => {
        setLoading(true);
        try {
            const response = await getEvents(page, pageSize);
            if (response && response.success && response.events) {
                setData(response.events);
                setTotalPages(response.total_pages || 1);
                setCurrentPage(response.page || page);
            }
        } catch (err) {
            console.error("Error al cargar los eventos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventsData(currentPage);
    }, [currentPage]);

    const formatTime = (time: string) => {
        if (!time) return "00:00";
        return time.split(':').slice(0, 2).join(':');
    };

    const handleAttendance = async (eventId: string, sessionId: string, isAttending: boolean) => {
        // Guardamos copia del estado para revertir si la API falla
        const previousState = new Map(registeredSessions);

        try {
            if (isAttending) {
                const payload: SessionRegister = {
                    event_id: eventId,
                    session_id: sessionId
                };

                const response = await registerSession(payload);

                if (response.success) {
                    const registrationId = response.session_detail.id;

                    setRegisteredSessions(prev => {
                        const next = new Map(prev);
                        next.set(sessionId, registrationId);
                        return next;
                    });
                    console.log('Registro exitoso:', registrationId);
                } else {
                    alert('Error al procesar el registro');
                }
            } else {
                // Obtenemos el ID del registro guardado en nuestro Map
                const registrationId = registeredSessions.get(sessionId);

                if (!registrationId) {
                    console.warn("No se encontró ID de registro para cancelar");
                    return;
                }


                const response = await deleteRegisterSession(registrationId);

                if (response.success) {
                    setRegisteredSessions(prev => {
                        const next = new Map(prev);
                        next.delete(sessionId);
                        return next;
                    });
                    console.log('Borrado exitoso');
                } else {
                    alert('Error al procesar el borrado');
                }
            }
        } catch (error) {
            console.error("Error en la operación:", error);
            setRegisteredSessions(previousState);
            alert('Error al conectar con el servidor');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && data.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4 md:p-8">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
        );
    }

    return (
        <section className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
            <header className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Descubrir Eventos</h1>
                <p className="text-base md:text-xl text-gray-600 font-medium max-w-3xl">Explora y regístrate en las sesiones disponibles.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {data.map((item) => (
                    <motion.article
                        key={item.event.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#333333] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 flex flex-col"
                    >
                        {/* Event Header */}
                        <div className="p-6 md:p-10 space-y-5 bg-gradient-to-br from-white/10 to-transparent border-b border-white/5">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{item.event.title}</h2>
                                <div className="inline-flex items-center gap-2 bg-[#9ACD32]/30 text-[#9ACD32] px-4 py-1.5 rounded-full text-xs font-black border border-[#9ACD32]/40 uppercase">
                                    <Users size={16} />
                                    <span>Capacidad: {item.event.capacity}</span>
                                </div>
                            </div>
                            <p className="text-gray-100 text-base md:text-lg font-medium">{item.event.description}</p>
                        </div>

                        {/* Sessions Area */}
                        <div className="p-5 md:p-10 flex-1 space-y-8">
                            {item.sessions && item.sessions.length > 0 ? (
                                item.sessions.map((sessionItem) => {
                                    const s = sessionItem.session;
                                    const isRegistered = registeredSessions.has(s.id);

                                    return (
                                        <motion.div
                                            key={s.id}
                                            layout
                                            className="bg-black/20 rounded-[2rem] p-6 md:p-8 border border-white/10 space-y-6"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                                <div className="space-y-3 flex-1">
                                                    <h3 className="font-bold text-white text-xl md:text-2xl flex flex-wrap items-center gap-3">
                                                        {s.title}
                                                        {isRegistered && (
                                                            <span className="flex items-center gap-1.5 text-xs bg-[#9ACD32] text-black px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-xl">
                                                                <CheckCircle size={14} /> Registrada
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-base md:text-lg text-gray-200 italic font-medium">"{s.description}"</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-[#9ACD32] font-black bg-black/40 px-5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                                                    <Clock size={20} />
                                                    {formatTime(sessionItem.time_slot.start_time)} - {formatTime(sessionItem.time_slot.end_time)}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                {!isRegistered ? (
                                                    <button
                                                        onClick={() => handleAttendance(item.event.id, s.id, true)}
                                                        className="flex-1 bg-[#9ACD32] hover:bg-[#b5f04b] text-black font-black py-5 rounded-[1.25rem] transition-all flex items-center justify-center gap-3 text-lg uppercase border-b-8 border-[#74a123]"
                                                    >
                                                        <CheckCircle size={26} strokeWidth={3} /> Asistir
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAttendance(item.event.id, s.id, false)}
                                                        className="flex-1 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 border-2 border-white/20 hover:border-red-500/50 font-black py-5 rounded-[1.25rem] transition-all flex items-center justify-center gap-3 text-lg uppercase"
                                                    >
                                                        <XCircle size={26} strokeWidth={3} /> No asistir
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-gray-400">No hay sesiones disponibles.</p>
                            )}
                        </div>
                    </motion.article>
                ))}
            </div>

            {!loading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </section>
    );
};

export default EventDiscovery;