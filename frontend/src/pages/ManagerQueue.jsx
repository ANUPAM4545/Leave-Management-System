
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ActionModal from '../components/ActionModal';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { CheckIcon, XMarkIcon, FunnelIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ManagerQueue() {
    const [requests, setRequests] = useState([]);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'PENDING');
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
        try {
            const data = await api.getManagerQueue(activeTab);
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load requests", error);
            setRequests([]);
            addToast('Failed to load requests', 'error');
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

    return (
        <Layout>
            <div className="mb-8">
                <Link to="/manager-dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors duration-200">
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Queue</h2>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Review and act on leave requests.</p>
            </div>

            <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                    <button
                        key={tab}
                        className={`pb-2 px-4 font-medium text-sm transition-colors duration-200 ${activeTab === tab
                            ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{request.user.username}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{request.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{request.leave_type.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{request.start_date} to {request.end_date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={request.reason}>{request.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Badge status={request.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {request.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    className="!p-2 bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                                    onClick={() => openActionModal(request, 'approve')}
                                                    title="Approve"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="!p-2"
                                                    onClick={() => openActionModal(request, 'reject')}
                                                    title="Reject"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        {request.status !== 'PENDING' && (
                                            <span className="text-gray-400 text-sm italic">
                                                {request.manager_comment ? 'Commented' : 'No comment'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmAction}
                title={actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                actionType={actionType}
            />
        </Layout>
    );
}
