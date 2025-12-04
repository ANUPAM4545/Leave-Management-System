import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ManagerStats from '../components/ManagerStats';
import ActionModal from '../components/ActionModal';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { InboxStackIcon, CheckIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
            // Take only the first 5 for preview
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
            loadDashboardData(); // Reload to update list
        } catch (error) {
            addToast('Action failed', 'error');
        }
    };

    return (
        <Layout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h2>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Oversee team leaves and approvals.</p>
                </div>
                <Link to="/manager-queue">
                    <Button variant="secondary">
                        View Full Queue
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <ManagerStats />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Requests Preview */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Requests</h3>
                            <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${activeTab === tab
                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flow-root">
                            <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                                {isLoading ? (
                                    <li className="py-4 text-center text-gray-500">Loading...</li>
                                ) : recentRequests.length === 0 ? (
                                    <li className="py-4 text-center text-gray-500">No {activeTab.toLowerCase()} requests.</li>
                                ) : (
                                    recentRequests.map((request) => (
                                        <li key={request.id} className="py-4">
                                            <div className="flex items-center justify-between space-x-4">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                        {request.user.username}
                                                    </p>
                                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                        {request.leave_type.name} • {request.start_date} to {request.end_date}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {request.status === 'PENDING' ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => openActionModal(request, 'approve')}
                                                            >
                                                                <CheckIcon className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                onClick={() => openActionModal(request, 'reject')}
                                                            >
                                                                <XMarkIcon className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Badge variant={request.status === 'APPROVED' ? 'success' : 'danger'}>
                                                            {request.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        {recentRequests.length > 0 && (
                            <div className="mt-6">
                                <Link to={`/manager-queue?status=${activeTab}`} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors duration-200">
                                    View all {activeTab.toLowerCase()} requests
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Quick Links / Actions */}
                <div className="lg:col-span-1">
                    <Card title="Quick Actions" className="h-full">
                        <div className="mt-4 space-y-4">
                            <Link to="/manager-queue" className="block">
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors duration-200 group cursor-pointer">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <InboxStackIcon className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-indigo-600">
                                                Manage Queue
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Review and process all leave requests.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>

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
