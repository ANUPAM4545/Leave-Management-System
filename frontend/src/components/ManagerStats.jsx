import { useState, useEffect } from 'react';
import Card from './ui/Card';
import { api } from '../utils/api';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function ManagerStats() {
    const [stats, setStats] = useState({ pending: 0, approved_today: 0, rejected_total: 0 });

    useEffect(() => {
        api.getManagerStats().then(setStats);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
            <Card className="border-l-4 border-l-yellow-400">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <ClockIcon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                    </div>
                </div>
            </Card>

            <Card className="border-l-4 border-l-green-400">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <CheckCircleIcon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Approved Today</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.approved_today}</p>
                    </div>
                </div>
            </Card>

            <Card className="border-l-4 border-l-red-400">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                        <XCircleIcon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Rejected</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.rejected_total}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
