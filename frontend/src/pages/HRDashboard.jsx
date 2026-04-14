import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { SparklesIcon, ChartBarIcon, UsersIcon, CalendarDaysIcon, GlobeAltIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    show: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function HRDashboard() {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const displayName = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.first_name || user?.username || 'HR Administrator';

    useEffect(() => {
        setIsLoading(true);
        api.getHRSummary().then(data => {
            setLeaves(data);
            setIsLoading(false);
        });
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const stats = [
        { label: 'Total Applications', value: leaves.length, icon: ChartBarIcon, color: 'brand' },
        { label: 'Active Employees', value: '48', icon: UsersIcon, color: 'emerald' },
        { label: 'Dept. Compliance', value: '98%', icon: GlobeAltIcon, color: 'indigo' },
    ];

    return (
        <Layout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="space-y-10"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-widest mb-4">
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Administrative Oversight
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Overview</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Hello, <span className="text-brand-500 font-bold">{displayName}</span>. Here's a global view of organizational activity.</p>
                    </div>
                </div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                        >
                            <Card className="border-none !bg-white/50 dark:!bg-slate-900/40 backdrop-blur-xl !shadow-premium overflow-hidden group">
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                                        <stat.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{stat.value}</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ArrowTrendingUpIcon className="w-12 h-12 text-slate-400" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <ChartBarIcon className="w-6 h-6 text-brand-500" />
                        Global Activity log
                    </h3>
                    <Card className="overflow-hidden border-none p-0 !bg-transparent !shadow-none">
                        <div className="overflow-x-auto rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-premium">
                            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Team Member</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Leave Category</th>
                                        <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeline</th>
                                        <th scope="col" className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <AnimatePresence mode="popLayout">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-24 text-center">
                                                    <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fetching Central Data...</p>
                                                </td>
                                            </tr>
                                        ) : leaves.map((leave, idx) => (
                                            <motion.tr
                                                key={leave.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="hover:bg-slate-50/50 dark:hover:bg-brand-500/5 transition-colors group"
                                            >
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 font-black text-slate-400 uppercase tracking-tighter group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                                                            {leave.user.username.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{leave.user.username}</div>
                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{leave.user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <Badge variant="brand" className="border-none !bg-brand-500/5 !text-brand-500">{leave.leave_type.name}</Badge>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                                        <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                                                        {formatDate(leave.start_date)} — {formatDate(leave.end_date)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-right">
                                                    <Badge variant={leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}>
                                                        {leave.status}
                                                    </Badge>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </Layout>
    );
}
