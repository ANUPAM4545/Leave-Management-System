import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

export default function ActionModal({ isOpen, onClose, onConfirm, title, actionType, isLoading }) {
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(comment);
        setComment('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 px-8 pt-8 pb-8 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg shadow-brand-500/10 border border-slate-200 dark:border-slate-800"
                        >
                            {/* Close button */}
                            <div className="absolute top-6 right-6">
                                <button
                                    type="button"
                                    className="rounded-full p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-brand-500 transition-colors focus:outline-none"
                                    onClick={onClose}
                                >
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="text-center sm:text-left w-full">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {title}
                                    </h3>
                                    <div className="mt-4">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            Please provide a reason or additional instructions for this action.
                                        </p>
                                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                            <div className="relative">
                                                <textarea
                                                    rows={5}
                                                    className="block w-full rounded-2xl border-none bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-brand-500 sm:text-sm p-5 font-medium placeholder-slate-400 dark:placeholder-slate-600 resize-none transition-all duration-300"
                                                    placeholder="Add your notes here... (optional)"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                                <div className="absolute top-5 right-5 text-slate-400">
                                                    <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 sm:flex-row-reverse">
                                                <Button
                                                    type="submit"
                                                    variant={actionType === 'reject' ? 'danger' : 'primary'}
                                                    className="flex-1 justify-center py-4"
                                                    isLoading={isLoading}
                                                >
                                                    CONFIRM ACTION
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="flex-1 justify-center py-4 text-slate-500 font-bold"
                                                    onClick={onClose}
                                                >
                                                    CANCEL
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
