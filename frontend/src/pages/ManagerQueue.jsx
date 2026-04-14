import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ActionModal from '../components/ActionModal';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { CheckIcon, XMarkIcon, ArrowLeftIcon, SparklesIcon, InboxStackIcon, CalendarDaysIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ManagerQueue() {
    const [requests, setRequests] = useState([]);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'PENDING');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const statusParam = searchParams.get('status');
        if (statusParam && ['PENDING', 'APPROVED', 'REJECTED'].includes(statusParam)) {
            setActiveTab(statusParam);
        }
    }, [searchParams]);

    useEffect(() => {
        loadRequests();
    }, [activeTab]);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const data = await api.getManagerQueue(activeTab);
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load requests", error);
            setRequests([]);
            addToast('Failed to load requests', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const openActionModal = (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        setIsModalOpen(true);
    };

    const handleConfirmAction = async (comment) => {
        if (!selectedRequest || !actionType) return;

        try {
            await api.actionLeave(selectedRequest.id, actionType, comment);
            addToast(`Leave request ${actionType}ed successfully`, 'success');
            setIsModalOpen(false);
            loadRequests();
        } catch (err) {
            addToast('Action failed', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
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
                <div className="mb-10">
                    <Link to="/manager-dashboard" className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-500 transition-all duration-300 mb-6 font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-brand-500/20 group">
                        <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Executive Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
                                <InboxStackIcon className="w-4 h-4 mr-2" />
                                Action Queue
                            </div>
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Leave Requests</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Systematic review of all incoming applications.</p>
                        </div>

                        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md rounded-[1.25rem] border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                            {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeTab === tab
                                        ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-premium ring-1 ring-slate-200/50 dark:ring-slate-600'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Card className="overflow-hidden border-none p-0 !bg-transparent !shadow-none !backdrop-blur-none">
                    <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-premium">
                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeline</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Rationale</th>
                                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th scope="col" className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-24 text-center">
                                                <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Queue...</p>
                                            </td>
                                        </tr>
                                    ) : requests.length > 0 ? (
                                        requests.map((request, idx) => (
                                            <motion.tr
                                                key={request.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="hover:bg-slate-50/50 dark:hover:bg-brand-500/5 transition-colors group"
                                            >
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 font-black text-slate-500 uppercase group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                                                            {request.user.username.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{request.user.username}</div>
                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{request.user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <Badge variant="brand" className="border-none !bg-brand-500/5 !text-brand-500">{request.leave_type.name}</Badge>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-1.5">
                                                            <CalendarDaysIcon className="w-3.5 h-3.5 text-slate-400" />
                                                            {formatDate(request.start_date)}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 ml-5">
                                                            until {formatDate(request.end_date)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 max-w-xs transition-all duration-300">
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed" title={request.reason}>
                                                        {request.reason}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <Badge variant={request.status === 'APPROVED' ? 'success' : request.status === 'REJECTED' ? 'danger' : 'warning'}>
                                                        {request.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-right">
                                                    {request.status === 'PENDING' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openActionModal(request, 'approve')}
                                                                className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all shadow-sm group/btn"
                                                                title="Approve"
                                                            >
                                                                <CheckIcon className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                                                            </button>
                                                            <button
                                                                onClick={() => openActionModal(request, 'reject')}
                                                                className="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-sm group/btn"
                                                                title="Reject"
                                                            >
                                                                <XMarkIcon className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-slate-600 transition-colors">
                                                            <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5" />
                                                            {request.manager_comment ? 'Documented' : 'No Notes'}
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-24 text-center">
                                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <InboxStackIcon className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest">No matching records</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Try adjusting your filters.</p>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>

            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmAction}
                title={actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                actionType={actionType}
                isLoading={false}
            />
        </Layout>
    );
}
