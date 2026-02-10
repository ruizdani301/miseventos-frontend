import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Generar array de números de página
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center mt-12 mb-8">
            <nav
                className="inline-flex items-center bg-[#1a1a1a] border border-white/10 rounded-full p-2 shadow-2xl backdrop-blur-md"
                aria-label="Paginación"
            >
                {/* Botón Anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full text-white hover:text-[#9ACD32] disabled:opacity-30 disabled:hover:text-white transition-all duration-300 active:scale-90"
                    aria-label="Página anterior"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>

                {/* Números de Página */}
                <div className="flex items-center gap-1 mx-2">
                    {pages.map((page) => {
                        const isActive = page === currentPage;
                        return (
                            <motion.button
                                key={page}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onPageChange(page)}
                                className={`
                                    min-w-[40px] h-[40px] flex items-center justify-center rounded-full text-sm font-black transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#9ACD32] text-black shadow-[0_0_15px_rgba(154,205,50,0.4)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                                `}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={`Página ${page}`}
                            >
                                {page}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Botón Siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full text-white hover:text-[#9ACD32] disabled:opacity-30 disabled:hover:text-white transition-all duration-300 active:scale-90"
                    aria-label="Página siguiente"
                >
                    <ChevronRight size={24} strokeWidth={2.5} />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
