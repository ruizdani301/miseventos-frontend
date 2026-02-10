import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, LogIn, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

const UserLoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(formData.email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            console.log("Login success");
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
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
                    <div className="mx-auto w-16 h-16 bg-[#9ACD32] rounded-2xl flex items-center justify-center text-black shadow-lg mb-4">
                        <LogIn size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bienvenido</h1>
                    <p className="text-gray-700 font-medium">Inicia sesión para gestionar tus eventos.</p>
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
                                aria-label="Correo electrónico"
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
                                aria-label="Contraseña"
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
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/10 text-red-900 border border-red-500/20 rounded-xl text-sm font-bold"
                                role="alert"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        type="submit"
                        className="w-full min-h-[56px] bg-[#9ACD32] hover:bg-[#b5f04b] disabled:bg-[#9ACD32]/50 disabled:cursor-not-allowed text-black font-black rounded-full shadow-xl transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest border-b-4 border-[#74a123] active:border-b-0"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </motion.button>
                </form>

                <footer className="text-center pt-4 border-t border-black/10">
                    <p className="text-sm text-gray-800 font-medium">
                        ¿No tienes una cuenta? <Link to="/register" className="text-black font-black hover:underline underline-offset-4 decoration-[#9ACD32] decoration-2">Regístrate aquí</Link>
                    </p>
                </footer>
            </motion.div>
        </div>
    );
};

export default UserLoginForm;
