import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
    PlusIcon,
    ListBulletIcon,
    ClockIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowUpRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total_allowance: 24,
        used_leaves: 0,
        pending_requests: 0,
        available_balance: 24
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

    const displayName = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.first_name || user?.username || 'User';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsData, holidaysData] = await Promise.all([
                    api.getEmployeeStats(),
                    api.getHolidays()
                ]);

                setStats({
                    total_allowance: statsData.total_allowance,
                    used_leaves: statsData.used_leaves,
                    pending_requests: statsData.pending_requests,
                    available_balance: statsData.available_balance
                });
                setRecentActivity(statsData.recent_activity || []);
                setHolidays(holidaysData || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatHolidayDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'REJECTED': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
            case 'PENDING': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
        }
    };

    return (
        <Layout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Hero Section */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 sm:p-12 shadow-2xl"
                >
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="/Users/anupamsingh/.gemini/antigravity/brain/83c57d48-2ccb-4025-be8d-46684358d9c7/dashboard_hero_abstract_background.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-widest mb-4"
                            >
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                Employee Dashboard
                            </motion.div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                                Welcome back, <span className="text-brand-400">{displayName}</span>! 👋
                            </h2>
                            <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                                You have <span className="text-white font-bold">{stats.available_balance} days</span> of leave remaining.
                                Ready for a well-deserved break?
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link to="/create-leave">
                                    <Button size="lg" className="px-8 shadow-xl shadow-brand-500/40">
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Apply for Leave
                                    </Button>
                                </Link>
                                <Link to="/my-requests">
                                    <Button variant="secondary" size="lg" className="px-8 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md">
                                        <ListBulletIcon className="w-5 h-5 mr-2" />
                                        View History
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-48 h-48 rounded-3xl glass-dark border-brand-500/30 flex flex-col items-center justify-center p-6 text-center"
                            >
                                <p className="text-4xl font-black text-white">{stats.available_balance}</p>
                                <p className="text-xs font-bold text-brand-400 uppercase tracking-tighter mt-2">Days Balance</p>
                                <div className="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stats.available_balance / stats.total_allowance) * 100}%` }}
                                        className="h-full bg-brand-500"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Available Balance', value: stats.available_balance, icon: CalendarDaysIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Total Allowance', value: stats.total_allowance, icon: CheckCircleIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Used Leaves', value: stats.used_leaves, icon: ClockIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { label: 'Pending Requests', value: stats.pending_requests, icon: ListBulletIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    ].map((stat, idx) => (
                        <motion.div key={idx} variants={itemVariants}>
                            <Card className="group relative overflow-hidden border-none bg-white dark:bg-slate-900/40">
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-7 h-7" />
                                    </div>
                                </div>
                                <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ease-out bg-current ${stat.color}`}></div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Card
                            title="Recent Activity"
                            action={
                                <Link to="/my-requests" className="text-xs font-bold text-brand-600 hover:text-brand-500 flex items-center gap-1 group">
                                    FULL HISTORY <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            }
                        >
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                                        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
                                        <p className="text-sm text-slate-500 font-medium">Fetching records...</p>
                                    </div>
                                ) : recentActivity.length > 0 ? (
                                    recentActivity.map((activity, idx) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 hover:border-brand-500/30 transition-colors group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                                    <SparklesIcon className="w-6 h-6 text-brand-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{activity.leave_type}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        {formatDate(activity.start_date)} - {formatDate(activity.end_date)} • {activity.days} days
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(activity.status)}`}>
                                                {activity.status}
                                            </span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CalendarDaysIcon className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold">No recent leave requests</p>
                                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Time to plan a vacation?</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <Card className="h-full bg-gradient-to-br from-brand-600 to-brand-900 border-none">
                            <div className="relative z-10">
                                <h3 className="text-lg font-black text-white tracking-tight uppercase mb-6 flex items-center gap-2">
                                    <SparklesIcon className="w-6 h-6" /> Pro Tips
                                </h3>
                                <div className="space-y-8">
                                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                                        <p className="text-xs font-black text-brand-300 uppercase tracking-widest mb-2">Planning Ahead</p>
                                        <p className="text-sm text-slate-100 leading-relaxed font-medium">
                                            Apply for leave at least 2 weeks in advance to ensure smooth team coordination. Better for everyone!
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                                        <p className="text-xs font-black text-brand-300 uppercase tracking-widest mb-2">Did You Know?</p>
                                        <p className="text-sm text-slate-100 leading-relaxed font-medium">
                                            Unused leaves carry over to the next quarter? Check with HR for your specific policy details.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-12 p-6 rounded-2xl bg-brand-950/50 border border-brand-500/30">
                                    <p className="text-xs font-black text-brand-400 uppercase tracking-widest mb-4">Upcoming Office Holidays</p>
                                    <ul className="space-y-4">
                                        {holidays.length > 0 ? (
                                            holidays.map((holiday, idx) => (
                                                <li key={idx} className="flex justify-between items-center bg-brand-900/30 p-2 rounded-lg border border-brand-500/10">
                                                    <span className="text-sm font-bold text-white truncate mr-2" title={holiday.name}>{holiday.name}</span>
                                                    <span className="text-[10px] font-black bg-brand-500 text-white px-2 py-0.5 rounded whitespace-nowrap">
                                                        {formatHolidayDate(holiday.date)}
                                                    </span>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-xs text-brand-300 italic">No upcoming holidays scheduled.</p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </Layout>
    );
}
