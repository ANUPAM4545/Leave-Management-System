import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import { api } from '../utils/api';
import { ClockIcon, CheckCircleIcon, XCircleIcon, UsersIcon } from '@heroicons/react/24/outline';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ManagerStats() {
    const [stats, setStats] = useState({ pending: 0, approved_today: 0, rejected_total: 0 });

    useEffect(() => {
        api.getManagerStats().then(setStats);
    }, []);

    const statConfig = [
        {
            label: 'Pending Requests',
            value: stats.pending,
            icon: ClockIcon,
            color: 'amber',
            bg: 'bg-amber-500/10',
            text: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-500/20'
        },
        {
            label: 'Approved Today',
            value: stats.approved_today,
            icon: CheckCircleIcon,
            color: 'emerald',
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-500/20'
        },
        {
            label: 'Total Rejected',
            value: stats.rejected_total,
            icon: XCircleIcon,
            color: 'rose',
            bg: 'bg-rose-500/10',
            text: 'text-rose-600 dark:text-rose-400',
            border: 'border-rose-500/20'
        }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10"
        >
            {statConfig.map((stat, idx) => (
                <motion.div key={idx} variants={item}>
                    <Card className={`relative overflow-hidden group border-none !bg-white dark:!bg-slate-900/40 !shadow-premium`}>
                        <div className="flex items-center">
                            <div className={`${stat.bg} ${stat.text} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div className="ml-5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">{stat.value}</p>
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 h-1 w-0 bg-current ${stat.text} group-hover:w-full transition-all duration-700 opacity-20`}></div>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
