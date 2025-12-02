import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import Card from '../components/ui/Card';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function HRDashboard() {
    const [leaves, setLeaves] = useState([]);
    const { user } = useAuth();

    // Get display name - prefer full name, fallback to username
    const displayName = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.first_name || user?.username || 'HR';

    useEffect(() => {
        api.getHRSummary().then(setLeaves);
    }, []);

    return (
        <Layout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">HR Dashboard - {displayName}</h2>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Overview of all leave requests.</p>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {leaves.map((leave) => (
                                <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{leave.user.username}</div>
                                        <div className="text-sm text-gray-500">{leave.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{leave.leave_type.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{leave.start_date} to {leave.end_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Badge status={leave.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </Layout>
    );
}
