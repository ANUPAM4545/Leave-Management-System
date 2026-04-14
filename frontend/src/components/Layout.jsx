import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="flex min-h-screen bg-[#050505] font-sans selection:bg-brand-500/30">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            
            <main className="flex-1 overflow-x-hidden transition-all duration-500 ease-in-out flex flex-col relative z-10 w-full min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-30 glass-dark border-b border-brand-500/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-gradient">
                            <span className="text-white text-xs font-black">L</span>
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            LMS Pro
                        </span>
                    </div>
                    <button onClick={toggleMobileMenu} className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 flex-1 w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
