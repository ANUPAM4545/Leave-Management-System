import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    {/* Close button */}
                    <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                        <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Please provide a comment for this action.
                                </p>
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <textarea
                                        rows={4}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        placeholder="Add a comment (optional)..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <Button
                                            type="submit"
                                            variant={actionType === 'reject' ? 'danger' : 'primary'}
                                            className="w-full justify-center sm:col-start-2"
                                            isLoading={isLoading}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="mt-3 w-full justify-center sm:col-start-1 sm:mt-0"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
