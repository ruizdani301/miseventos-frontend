import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, User, Info, CheckCircle, XCircle, MapPin, LogOut } from 'lucide-react';
import { getEvents } from '../../services/eventService';
import type { EventItem, SessionRegister } from '../../types';
import Pagination from '../common/Pagination';
import { registerSession, deleteRegisterSession } from '../../services/sessionRegisterService';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';



// --- Skeleton Component ---
const SkeletonCard = () => (
    <div className="bg-[#333333] rounded-[2.5rem] p-8 animate-pulse space-y-6 border border-white/5">
        {/* Event Header Skeleton */}
        <div className="space-y-3 pb-6 border-b border-white/5">
            <div className="h-8 bg-white/20 rounded-lg w-3/4"></div>
            <div className="h-4 bg-white/10 rounded-lg w-full"></div>
        </div>

        {/* Sessions Grid Skeleton - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-black/20 p-5 rounded-[1.5rem] space-y-4 border border-white/10">
                    <div className="h-6 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                    <div className="h-12 bg-white/10 rounded-xl mt-4"></div>
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

    const navigate = useNavigate();

    const fetchEventsData = async (page: number, silent: boolean = false) => {
        // Only show loading skeleton if not a silent refresh
        if (!silent) {
            setLoading(true);
        }

        try {
            const response = await getEvents(page, pageSize);
            if (response && response.success && response.events) {
                setData(response.events);
                setTotalPages(response.total_pages || 1);
                setCurrentPage(response.page || page);

                const newRegisteredSessions = new Map<string, string>();
                response.events.forEach(eventItem => {
                    eventItem.sessions.forEach(sessionItem => {
                        const sessionId = sessionItem.session.id;
                        const registrationId = sessionItem.session.user_registration_id;

                        // If user is registered, add to Map
                        if (registrationId) {
                            newRegisteredSessions.set(sessionId, registrationId);
                        }
                    });
                });

                setRegisteredSessions(newRegisteredSessions);
            }
        } catch (err) {
            console.error("Error al cargar los eventos:", err);
        } finally {
            if (!silent) {
                setLoading(false);
            }
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

                    // Silent refresh to update registrations_count from server
                    await fetchEventsData(currentPage, true);
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

                    // Silent refresh to update registrations_count from server
                    await fetchEventsData(currentPage, true);
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
    const handleLogout = async () => {
        const response = await logout();
        if (response.success) {
            navigate('/login');
        }
        else {
            console.error('Error al cerrar sesión');
        }
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && data.length === 0) {
        return (
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
                {[1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
        );
    }

    return (
        <section className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 relative">
            <header className="flex justify-between items-start gap-4">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Descubre los Eventos</h1>
                    <p className="text-base md:text-xl text-gray-600 font-medium max-w-3xl">Explora y regístrate en las sesiones disponibles.</p>
                </div>

                {/* Botón Logout Responsivo */}
                <button
                    onClick={() => handleLogout()}
                    className="bg-[#9ACD32] hover:bg-[#b5f04b] text-black font-black p-3 md:px-5 md:py-2.5 rounded-full transition-all flex items-center justify-center gap-2 uppercase text-sm border-b-4 border-[#74a123] active:border-b-0 active:translate-y-1 shadow-lg"
                    title="Cerrar sesión"
                >
                    <LogOut size={20} strokeWidth={3} />
                    <span className="hidden md:block">Cerrar Sesión</span>
                </button>
            </header>

            <div className="space-y-8">
                {data.map((item) => (
                    <motion.article
                        key={item.event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#333333] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5"
                    >
                        {/* Event Header */}
                        <div className="p-6 md:p-8 lg:p-10 space-y-4 bg-gradient-to-br from-white/10 to-transparent border-b border-white/5">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">{item.event.title}</h2>
                                <div className="inline-flex items-center gap-2 bg-[#9ACD32]/30 text-[#9ACD32] px-4 py-2 rounded-full text-xs font-black border border-[#9ACD32]/40 uppercase whitespace-nowrap">
                                    <Users size={16} />
                                    <span>Capacidad: {item.event.capacity} Registrados: {item.event.registrations_count}</span>
                                </div>
                            </div>
                            <p className="text-gray-100 text-base md:text-lg font-medium">{item.event.description}</p>
                        </div>

                        {/* Sessions Grid - Responsive 3 columns */}
                        <div className="p-5 md:p-8 lg:p-10">
                            {item.sessions && item.sessions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                                    {item.sessions.map((sessionItem) => {
                                        const s = sessionItem.session;
                                        const isRegistered = registeredSessions.has(s.id);
                                        const isFull = s.registrations_count >= s.capacity;

                                        return (
                                            <motion.div
                                                key={s.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                                className="bg-black/20 rounded-[1.5rem] p-5 border border-white/10 flex flex-col h-full"
                                            >
                                                {/* Session Header with Title and Badge */}
                                                <div className="space-y-3 mb-4">
                                                    <h3 className="font-bold text-white text-lg lg:text-xl flex flex-col gap-2">
                                                        <span>{s.title}</span>
                                                        {isRegistered && (
                                                            <span className="inline-flex items-center gap-1.5 text-xs bg-[#9ACD32] text-black px-3 py-1.5 rounded-full font-black uppercase tracking-wide shadow-lg self-start">
                                                                <CheckCircle size={12} /> Registrada
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[#9ACD32]/50 scrollbar-track-black/20 pr-2">
                                                        <p className="text-sm md:text-base text-gray-200 italic font-medium">"{s.description}"</p>
                                                    </div>
                                                </div>

                                                {/* Time and Stats Section */}
                                                <div className="space-y-3 mb-4">
                                                    {/* Time Block */}
                                                    <div className="flex items-center gap-2 text-[#9ACD32] font-black bg-black/40 px-4 py-2 rounded-xl border border-white/10 shadow-md text-sm">
                                                        <Clock size={16} />
                                                        <span className="whitespace-nowrap">
                                                            {formatTime(sessionItem.time_slot.start_time)} - {formatTime(sessionItem.time_slot.end_time)}
                                                        </span>
                                                    </div>

                                                    {/* Capacity and Registration Stats */}
                                                    <div className="flex flex-col gap-2 bg-[#9ACD32]/20 p-3 rounded-xl border border-[#9ACD32]/30">
                                                        {/* Capacity Row */}
                                                        <div className="flex items-center justify-between text-xs font-black uppercase">
                                                            <div className="flex items-center gap-2 text-[#9ACD32]">
                                                                <Users size={12} className="opacity-70" />
                                                                <span>Capacidad</span>
                                                            </div>
                                                            <span className="text-white">{s.capacity}</span>
                                                        </div>

                                                        {/* Divider */}
                                                        <div className="h-[1px] bg-[#9ACD32]/20 w-full"></div>

                                                        {/* Registered Row */}
                                                        <div className="flex items-center justify-between text-xs font-black uppercase">
                                                            <div className="flex items-center gap-2 text-[#9ACD32]">
                                                                <div className="w-3 h-3 rounded-full bg-[#9ACD32] flex items-center justify-center">
                                                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                                                </div>
                                                                <span>Registrados</span>
                                                            </div>
                                                            <span className="text-white">{s.registrations_count}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Full Capacity Warning */}
                                                {isFull && !isRegistered && (
                                                    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/40 rounded-xl p-3 flex items-center justify-center gap-2">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                        <span className="text-red-400 font-black text-xs uppercase tracking-wide">Cupos Llenos</span>
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                    </div>
                                                )}

                                                {/* Spacer to push button to bottom */}
                                                <div className="flex-grow"></div>

                                                {/* Action Button - Anchored to bottom */}
                                                <div className="mt-auto pt-4">
                                                    {!isRegistered ? (
                                                        <button
                                                            onClick={() => handleAttendance(item.event.id, s.id, true)}
                                                            disabled={isFull}
                                                            className={`w-full font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base uppercase shadow-lg ${isFull
                                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-b-4 border-gray-700'
                                                                : 'bg-[#9ACD32] hover:bg-[#b5f04b] text-black border-b-4 border-[#74a123] active:border-b-0 active:translate-y-1'
                                                                }`}
                                                        >
                                                            <CheckCircle size={20} strokeWidth={3} /> {isFull ? 'Sin Cupos' : 'Asistir'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAttendance(item.event.id, s.id, false)}
                                                            className="w-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 border-2 border-white/20 hover:border-red-500/50 font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base uppercase shadow-md"
                                                        >
                                                            <XCircle size={20} strokeWidth={3} /> No asistir
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-8">No hay sesiones disponibles.</p>
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