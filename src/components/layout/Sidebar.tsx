import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    Clock,
    Calendar,
    UserCheck,
    Presentation,
    ShieldCheck,
    ChevronLeft,
    Search
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    isCollapsed,
    setIsCollapsed
}) => {
    const menuItems = [
        { name: 'Gestión de Eventos', icon: Calendar },
        { name: 'Gestión de Horarios', icon: Clock },
        { name: 'Gestión de Ponentes', icon: UserCheck },
        { name: 'Gestión de Sesiones', icon: Presentation },
        { name: 'Roles', icon: ShieldCheck },
        { name: 'Descubrir Eventos', icon: Search },
    ];

    const sidebarVariants = {
        expanded: { width: '320px' },
        collapsed: { width: '80px' }
    };

    return (
        <motion.aside
            initial={false}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={sidebarVariants}
            className="bg-[#696969] h-screen flex flex-col shadow-2xl relative z-50 text-white"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Header / Toggle Button */}
            <div className="p-4 flex items-center justify-between mb-8">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-xl font-black tracking-tighter"
                        >
                            ADMIN
                        </motion.h1>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#9ACD32]"
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                >
                    {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;

                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            aria-selected={isActive}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                                    ? 'bg-[#9ACD32] text-white shadow-lg'
                                    : 'hover:bg-white/10 text-gray-100 hover:text-white'
                                }`}
                        >
                            <div className="flex-shrink-0">
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-semibold text-lg whitespace-nowrap overflow-hidden"
                                >
                                    {item.name}
                                </motion.span>
                            )}

                            {/* Tooltip for collapsed mode */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-6 px-2 py-1 bg-[#9ACD32] text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-md">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / User Profile can go here */}
            <div className="p-4 border-t border-white/10">
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-[#9ACD32] border-2 border-white/20 flex items-center justify-center font-bold">
                        AD
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="text-base font-bold truncate">Administrador</p>
                            <p className="text-xs text-white/60 truncate">admin@miseventos.com</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
