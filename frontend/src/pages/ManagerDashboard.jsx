import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ManagerStats from '../components/ManagerStats';
import ActionModal from '../components/ActionModal';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { InboxStackIcon, CheckIcon, XMarkIcon, ArrowRightIcon, SparklesIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
    show: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export default function ManagerDashboard() {
    const [recentRequests, setRecentRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('PENDING');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        loadDashboardData();
    }, [activeTab]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const data = await api.getManagerQueue(activeTab);
            const dataArray = Array.isArray(data) ? data : [];
            setRecentRequests(dataArray.slice(0, 5));
        } catch (error) {
            console.error("Failed to load dashboard data", error);
            setRecentRequests([]);
            addToast('Failed to load dashboard data', 'error');
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
            loadDashboardData();
        } catch (error) {
            addToast('Action failed', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Management Perspective
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Manager Dashboard</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Oversee your team's leave health and streamline approvals.</p>
                    </div>
                    <Link to="/manager-queue">
                        <Button size="lg" className="shadow-lg shadow-brand-500/20">
                            VIEW FULL QUEUE
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                <ManagerStats />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Recent Requests Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <InboxStackIcon className="w-6 h-6 text-brand-500" />
                                Action Required
                            </h3>
                            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md rounded-[1.25rem] border border-slate-200/50 dark:border-slate-700/50">
                                {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeTab === tab
                                            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-premium ring-1 ring-slate-200/50 dark:ring-slate-600'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Card className="border-none !p-0 overflow-hidden !bg-white/50 dark:!bg-slate-900/40 !backdrop-blur-xl shadow-premium">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {isLoading ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-20 text-center"
                                        >
                                            <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Updating Queue...</p>
                                        </motion.div>
                                    ) : recentRequests.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-20 text-center"
                                        >
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <InboxStackIcon className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest">Nothing Here</p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">No {activeTab.toLowerCase()} requests currently.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.ul
                                            variants={stagger}
                                            initial="hidden"
                                            animate="show"
                                            className="divide-y divide-slate-100 dark:divide-slate-800"
                                        >
                                            {recentRequests.map((request) => (
                                                <motion.li
                                                    variants={fadeUp}
                                                    key={request.id}
                                                    className="px-8 py-6 hover:bg-slate-50/50 dark:hover:bg-brand-500/5 transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between gap-6">
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 group-hover:bg-brand-600 transition-colors duration-500">
                                                                <span className="text-brand-600 group-hover:text-white font-black text-lg uppercase">{request.user.username.charAt(0)}</span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-brand-500 transition-colors">
                                                                    {request.user.username}
                                                                </p>
                                                                <div className="flex items-center gap-3 mt-1.5">
                                                                    <Badge variant="brand" className="!bg-brand-500/5 !text-brand-500 border-none px-.5">{request.leave_type.name}</Badge>
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                                        <CalendarDaysIcon className="w-3 h-3" />
                                                                        {formatDate(request.start_date)} - {formatDate(request.end_date)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {request.status === 'PENDING' ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => openActionModal(request, 'approve')}
                                                                        className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all shadow-sm group/btn"
                                                                    >
                                                                        <CheckIcon className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openActionModal(request, 'reject')}
                                                                        className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-sm group/btn"
                                                                    >
                                                                        <XMarkIcon className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <Badge variant={request.status === 'APPROVED' ? 'success' : 'danger'}>
                                                                    {request.status}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                            {recentRequests.length > 0 && (
                                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
                                    <Link to={`/manager-queue?status=${activeTab}`} className="flex items-center justify-center w-full py-3 text-[10px] font-black text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 dark:hover:text-white rounded-xl transition-all uppercase tracking-widest border border-brand-500/20">
                                        Explorate all {activeTab.toLowerCase()} requests
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Pro Tips / Team Health */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6 mt-1 flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6 text-brand-500" />
                                Team Insights
                            </h3>
                            <Card className="border-none !bg-brand-600 !text-white !p-8 shadow-2xl shadow-brand-500/40 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-4 opacity-80">Manager's Note</h4>
                                    <p className="text-lg font-bold leading-relaxed mb-8">
                                        "Approving requests promptly keeps team morale high and allows for better resource scheduling."
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <UsersIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">Active Team</p>
                                            <p className="text-sm font-bold opacity-80">12 Members</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            </Card>
                        </div>

                        <Card title="Quick Resources" className="border-none !shadow-premium !bg-white/50 dark:!bg-slate-900/40 backdrop-blur-xl">
                            <div className="space-y-4">
                                {[
                                    { label: 'Leave Policy', desc: 'Revised Jan 2026' },
                                    { label: 'Team Calendar', desc: 'Sync with Outlook' },
                                    { label: 'Onboarding Guide', desc: 'For new managers' }
                                ].map((link, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-500/10 cursor-pointer transition-all border border-transparent hover:border-brand-500/20 group">
                                        <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-brand-500 transition-colors">{link.label}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-tighter">{link.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
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

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
