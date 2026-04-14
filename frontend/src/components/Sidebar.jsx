import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROLES } from '../utils/role';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    PlusCircleIcon,
    ClipboardDocumentListIcon,
    InboxStackIcon,
    ArrowLeftOnRectangleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Sidebar = ({ isCollapsed, toggleSidebar, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavItemClick = () => {
        if (setIsMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon, label }) => (
        <Link
            to={to}
            onClick={handleNavItemClick}
            className="group relative flex items-center mb-1 overflow-hidden rounded-2xl transition-all duration-300"
        >
            <motion.div
                className={`flex items-center w-full px-4 py-3.5 text-sm font-semibold transition-all duration-300
                    ${isActive(to)
                        ? 'bg-brand-600/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                    } ${isCollapsed ? 'justify-center md:justify-center' : ''}`}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
            >
                {isActive(to) && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1.5 h-8 bg-brand-600 dark:bg-brand-500 rounded-r-full"
                    />
                )}
                <span className={`${isCollapsed ? '' : 'mr-3.5'} transition-transform duration-300 group-hover:scale-110`}>
                    {icon}
                </span>
                {!isCollapsed && <span className="relative z-10">{label}</span>}
            </motion.div>
        </Link>
    );

    return (
        <aside
            className={`${isCollapsed ? 'md:w-24' : 'md:w-72'} 
            fixed md:relative inset-y-0 left-0 w-72 md:w-auto z-50 transform 
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 
            glass dark:glass-dark border-r border-slate-200/50 dark:border-brand-500/10 flex flex-col h-screen transition-all duration-300 ease-in-out`}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between h-24">
                {(!isCollapsed || isMobileMenuOpen) && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3.5 overflow-hidden"
                    >
                        <div className="h-11 w-11 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-brand-500/25 animate-gradient">
                            <SparklesIcon className="h-6.5 w-6.5 text-white" />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-brand-200 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                            LMS Pro
                        </span>
                    </motion.div>
                )}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className={`hidden md:flex p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 focus:outline-none transition-all ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    {isMobileMenuOpen && (
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl focus:outline-none bg-slate-800/50"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 overflow-y-auto overflow-x-hidden scrollbar-hide">
                <div className="space-y-1.5">
                    {user?.role === ROLES.EMPLOYEE && (
                        <>
                            <NavItem to="/employee-dashboard" label="Overview" icon={<HomeIcon className="w-6 h-6" />} />
                            <NavItem to="/create-leave" label="Apply Leave" icon={<PlusCircleIcon className="w-6 h-6" />} />
                            <NavItem to="/my-requests" label="My Requests" icon={<ClipboardDocumentListIcon className="w-6 h-6" />} />
                        </>
                    )}

                    {user?.role === ROLES.MANAGER && (
                        <>
                            <NavItem to="/manager-dashboard" label="Overview" icon={<HomeIcon className="w-6 h-6" />} />
                            <NavItem to="/manager-queue" label="Review Queue" icon={<InboxStackIcon className="w-6 h-6" />} />
                        </>
                    )}

                    {user?.role === ROLES.HR && (
                        <>
                            <NavItem to="/hr-dashboard" label="Overview" icon={<HomeIcon className="w-6 h-6" />} />
                        </>
                    )}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-5 space-y-5 border-t border-slate-200/50 dark:border-brand-500/10 bg-black/20">
                {/* Theme Toggle - Force true dark for texture, but keep toggle functionality */}
                <button
                    onClick={toggleTheme}
                    className={`group w-full flex items-center px-4 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-500/10 rounded-2xl transition-all duration-300 ${isCollapsed ? 'md:justify-center px-0' : ''}`}
                >
                    <div className="relative overflow-hidden w-6 h-6 transition-transform group-hover:rotate-12">
                        {theme === 'dark' ? <SunIcon className="w-full h-full text-brand-400" /> : <MoonIcon className="w-full h-full text-brand-600" />}
                    </div>
                    {(!isCollapsed || isMobileMenuOpen) && <span className="ml-3.5">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                {/* User Profile & Logout */}
                <div className={`p-2.5 rounded-3xl bg-slate-50/50 dark:bg-[#000000]/60 border border-slate-100 dark:border-brand-500/20 flex items-center ${isCollapsed ? 'md:justify-center md:flex-col md:gap-5 md:py-4' : 'gap-3.5'}`}>
                    {(!isCollapsed || isMobileMenuOpen) && (
                        <div className="flex items-center gap-3.5 flex-1 min-w-0 ml-1">
                            <div className="h-11 w-11 rounded-2xl bg-brand-900/40 flex items-center justify-center text-brand-400 font-black flex-shrink-0 border border-brand-800/50">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {user?.username}
                                </p>
                                <p className="text-[10px] uppercase font-black text-brand-500 tracking-widest truncate mt-0.5">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`group flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-300 ${(isCollapsed && !isMobileMenuOpen) ? 'p-2.5 w-full' : 'p-2.5'}`}
                        title="Sign Out"
                    >
                        <ArrowLeftOnRectangleIcon className="w-6.5 h-6.5 transition-transform group-hover:-translate-x-1" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
