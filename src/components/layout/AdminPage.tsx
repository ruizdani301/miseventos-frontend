import React, { useState } from 'react';

import Sidebar from './Sidebar';
import CreatedEvent from '../admin/CreatedEvent';
import Roles from '../admin/Roles';
import ScheduleForm from '../admin/ScheduleForm';
import SessionForm from '../admin/SessionForm';
import SpeakerForm from '../admin/SpeakerForm';
import EventDiscovery from '../home/EventDiscovery';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Gestión de Horarios');
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'Gestión de Horarios':
                return <ScheduleForm />;
            case 'Gestión de Eventos':
                return <CreatedEvent />;
            case 'Gestión de Ponentes':
                return <SpeakerForm />;
            case 'Gestión de Sesiones':
                return <SessionForm />;
            case 'Roles':
                return <Roles />;
            case 'Descubrir Eventos':
                return <EventDiscovery />;
            default:
                return <ScheduleForm />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header Placeholder / Content Area Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">{activeTab}</h2>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline">Panel de Administración v1.0</span>
                        <div className="w-8 h-8 rounded-full bg-[#9ACD32]/20 text-[#2c3e10] flex items-center justify-center font-bold text-xs ring-1 ring-[#9ACD32]/50">
                            A
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </div>
            </main>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #A9A9A9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
        </div>
    );
};

export default AdminPage;
