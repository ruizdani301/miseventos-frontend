import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendUser } from '../../services/userService';
import { Link } from 'react-router-dom';

const UserRegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setFeedback({ type: 'error', message: 'Por favor, ingresa un correo electrónico válido.' });
            return false;
        }
        if (formData.password.length < 8) {
            setFeedback({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres.' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await sendUser({
                email: formData.email,
                password: formData.password,
                role: 'assistant'
            });
            if (response.status !== 400) {
                setFeedback({ type: 'success', message: '¡Registro exitoso! Ya puedes iniciar sesión.' });
                setFormData({ email: '', password: '' });
            } else {
                setFeedback({ type: 'error', message: 'El usuario ya existe.' });
            }
        } catch (error: any) {
            setFeedback({
                type: 'error',
                message: error.message || 'Ocurrió un error al procesar el registro.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-[92%] md:max-w-md bg-[#A9A9A9] rounded-[2rem] shadow-2xl p-8 md:p-10 space-y-8 border border-white/20"
            >
                <header className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Crear Cuenta</h1>
                    <p className="text-gray-700 font-medium">Únete como asistente para gestionar eventos.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-gray-800 ml-1 uppercase tracking-wider"
                        >
                            Correo Electrónico
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#9ACD32] transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/50 border-2 border-transparent focus:border-[#9ACD32] rounded-2xl pl-12 pr-4 min-h-[48px] text-gray-900 font-medium placeholder-gray-500 focus:outline-none transition-all"
                                placeholder="tu@ejemplo.com"
                                aria-label="Ingresa tu correo electrónico"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-bold text-gray-800 ml-1 uppercase tracking-wider"
                        >
                            Contraseña
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#9ACD32] transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/50 border-2 border-transparent focus:border-[#9ACD32] rounded-2xl pl-12 pr-12 min-h-[48px] text-gray-900 font-medium placeholder-gray-500 focus:outline-none transition-all"
                                placeholder="••••••••"
                                aria-label="Ingresa tu contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-700 font-medium ml-1">
                            Debe tener al menos 8 caracteres.
                        </p>
                    </div>

                    {/* Feedback Messages */}
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold ${feedback.type === 'success'
                                    ? 'bg-[#9ACD32]/20 text-green-900 border border-[#9ACD32]/50'
                                    : 'bg-red-500/10 text-red-900 border border-red-500/20'
                                    }`}
                                role="alert"
                            >
                                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                {feedback.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        type="submit"
                        className="w-full min-h-[56px] bg-[#9ACD32] hover:bg-[#b5f04b] disabled:bg-[#9ACD32]/50 disabled:cursor-not-allowed text-black font-black rounded-full shadow-xl transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            'Registrarse'
                        )}
                    </motion.button>
                </form>

                <footer className="text-center pt-4 border-t border-black/10">
                    <p className="text-sm text-gray-800 font-medium">
                        ¿Ya tienes una cuenta? <Link to="/login" className="text-black font-black hover:underline underline-offset-4 decoration-[#9ACD32] decoration-2">Inicia sesión</Link>
                    </p>
                </footer>
            </motion.div>
        </div>
    );
};

export default UserRegistrationForm;
