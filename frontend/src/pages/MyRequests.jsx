import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { api } from '../utils/api';
import { SparklesIcon, CalendarDaysIcon, ChatBubbleBottomCenterTextIcon, InboxStackIcon } from '@heroicons/react/24/outline';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getLeaves().then(data => {
            setRequests(data);
            setLoading(false);
        });
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Layout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="space-y-8"
            >
                <div className="mb-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <InboxStackIcon className="w-4 h-4 mr-2" />
                        Application History
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Requests</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Manage and track your previous leave applications.</p>
                </div>

                <Card className="overflow-hidden border-none p-0 !bg-transparent !shadow-none !backdrop-blur-none">
                    <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-premium">
                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Reason</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Manager Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
                                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Loading history...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : requests.length > 0 ? (
                                        requests.map((request, idx) => (
                                            <motion.tr
                                                key={request.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default"
                                            >
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-brand-500 transition-colors duration-300">
                                                            <SparklesIcon className="w-5 h-5 text-brand-500 group-hover:text-white transition-colors" />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">{request.leave_type.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                                                            {formatDate(request.start_date)}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                            to {formatDate(request.end_date)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 max-w-xs">
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {request.reason}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <Badge variant={request.status === 'APPROVED' ? 'success' : request.status === 'REJECTED' ? 'danger' : 'warning'}>
                                                        {request.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 italic">
                                                        {request.manager_comment ? (
                                                            <>
                                                                <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-brand-500/50" />
                                                                <span className="line-clamp-1">{request.manager_comment}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-300 dark:text-slate-700">No feedback yet</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                                        <InboxStackIcon className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest">No records found</p>
                                                    <p className="text-xs text-slate-400 font-bold max-w-[200px] mx-auto uppercase tracking-tighter">You haven't submitted any leave requests yet.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </Layout>
    );
}
