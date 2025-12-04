import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROLES } from '../utils/role';
import {
    Bars3Icon,
    XMarkIcon,
    SunIcon,
    MoonIcon,
    HomeIcon,
    PlusCircleIcon,
    ClipboardDocumentListIcon,
    InboxStackIcon,
    UserGroupIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon, label }) => (
        <Link
            to={to}
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-150 mb-1
                ${isActive(to)
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? label : ''}
        >
            <span className={`${isCollapsed ? '' : 'mr-3'}`}>{icon}</span>
            {!isCollapsed && <span>{label}</span>}
        </Link>
    );

    return (
        <div
            className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-30`}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between h-16">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">LMS Pro</span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className={`p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isCollapsed ? 'mx-auto' : ''}`}
                >
                    {isCollapsed ? <Bars3Icon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto overflow-x-hidden">
                <div className="space-y-1">
                    {user?.role === ROLES.EMPLOYEE && (
                        <>
                            <NavItem to="/employee-dashboard" label="Dashboard" icon={<HomeIcon className="w-6 h-6" />} />
                            <NavItem to="/create-leave" label="Apply Leave" icon={<PlusCircleIcon className="w-6 h-6" />} />
                            <NavItem to="/my-requests" label="My Requests" icon={<ClipboardDocumentListIcon className="w-6 h-6" />} />
                        </>
                    )}

                    {user?.role === ROLES.MANAGER && (
                        <>
                            <NavItem to="/manager-dashboard" label="Dashboard" icon={<HomeIcon className="w-6 h-6" />} />
                            <NavItem to="/manager-queue" label="Review Queue" icon={<InboxStackIcon className="w-6 h-6" />} />
                        </>
                    )}

                    {user?.role === ROLES.HR && (
                        <>
                            <NavItem to="/hr-dashboard" label="Dashboard" icon={<HomeIcon className="w-6 h-6" />} />
                        </>
                    )}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-150 ${isCollapsed ? 'justify-center' : ''}`}
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                    {!isCollapsed && <span className="ml-3">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                {/* User Profile & Logout */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'gap-3'}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold flex-shrink-0">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                                    {user?.role?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150 ${isCollapsed ? 'p-2 w-full' : 'p-2'}`}
                        title="Sign Out"
                    >
                        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
