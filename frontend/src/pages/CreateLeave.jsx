import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { SparklesIcon, CalendarDaysIcon, ChatBubbleBottomCenterTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CreateLeave() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [formData, setFormData] = useState({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        api.getLeaveTypes().then(setLeaveTypes);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.createLeave(formData);
            addToast('Leave request submitted successfully!', 'success');
            navigate('/my-requests');
        } catch (err) {
            addToast('Failed to submit leave request', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="max-w-3xl mx-auto"
            >
                <div className="mb-10">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        New Application
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Apply for Leave</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Please provide accurate details for your absence request.</p>
                </div>

                <Card className="overflow-hidden border-none p-8 sm:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Leave Type
                            </label>
                            <div className="relative">
                                <select
                                    className="block w-full px-5 py-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all duration-300 font-medium sm:text-sm appearance-none cursor-pointer"
                                    value={formData.leave_type_id}
                                    onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select a type</option>
                                    {leaveTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            <Input
                                label="Start Date"
                                type="date"
                                required
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            />

                            <Input
                                label="End Date"
                                type="date"
                                required
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Reason for Leave
                            </label>
                            <div className="relative">
                                <textarea
                                    className="block w-full px-5 py-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all duration-300 font-medium sm:text-sm placeholder-slate-400 dark:placeholder-slate-600 resize-none"
                                    rows="5"
                                    required
                                    placeholder="Explain your reason briefly..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                ></textarea>
                                <div className="absolute top-4 right-4 text-slate-400">
                                    <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-8">
                            <Button
                                type="submit"
                                size="lg"
                                className="px-10"
                                isLoading={isLoading}
                            >
                                SUBMIT REQUEST <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </Layout>
    );
}
