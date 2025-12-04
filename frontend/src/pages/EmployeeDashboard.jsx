import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
    PlusIcon,
    ListBulletIcon,
    ClockIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total_allowance: 24,
        used_leaves: 0,
        pending_requests: 0,
        available_balance: 24
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get display name
    const displayName = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.first_name || user?.username || 'User';

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await api.getEmployeeStats();
                setStats({
                    total_allowance: data.total_allowance,
                    used_leaves: data.used_leaves,
                    pending_requests: data.pending_requests,
                    available_balance: data.available_balance
                });
                setRecentActivity(data.recent_activity || []);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchStats();

        // Poll for updates every 30 seconds
        const interval = setInterval(() => {
            fetchStats();
        }, 30000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'REJECTED':
                return <XCircleIcon className="w-5 h-5" />;
            case 'PENDING':
                return <ClockIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    // Get status icon background color
    const getStatusIconBg = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            case 'REJECTED':
                return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
            case 'PENDING':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
        }
    };


    return (
        <Layout>
            <div className="space-y-8">
                {/* Hero Section with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 shadow-xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white">
                            Welcome back, {displayName}! 👋
                        </h2>
                        <p className="mt-2 text-indigo-100 text-lg max-w-2xl">
                            You have <span className="font-bold text-white">{stats.available_balance} days</span> of leave remaining this year.
                            Plan your time off effectively.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <Link to="/create-leave">
                                <button className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white text-indigo-700 font-semibold shadow-sm hover:bg-indigo-50 transition-colors duration-200">
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Apply for Leave
                                </button>
                            </Link>
                            <Link to="/my-requests">
                                <button className="inline-flex items-center px-5 py-2.5 rounded-lg bg-indigo-700/50 text-white font-semibold border border-indigo-500 hover:bg-indigo-700 transition-colors duration-200 backdrop-blur-sm">
                                    <ListBulletIcon className="w-5 h-5 mr-2" />
                                    View History
                                </button>
                            </Link>
                        </div>
                    </div>
                    {/* Decorative background pattern */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-20 -mb-10 w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Balance</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.available_balance}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                                <CalendarDaysIcon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Allowance</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total_allowance}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Used Leaves</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.used_leaves}</p>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending_requests}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                                <ListBulletIcon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Activity & Quick Tips */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Requests Preview */}
                    <div className="lg:col-span-2">
                        <Card title="Recent Activity" className="h-full">
                            <div className="mt-4 space-y-4">
                                {loading ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        Loading...
                                    </div>
                                ) : recentActivity.length > 0 ? (
                                    recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-2 rounded-lg ${getStatusIconBg(activity.status)}`}>
                                                    {getStatusIcon(activity.status)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.leave_type}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(activity.start_date)} - {formatDate(activity.end_date)} ({activity.days} {activity.days === 1 ? 'day' : 'days'})
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                                {activity.status.charAt(0) + activity.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No recent activity
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                <Link to="/my-requests" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center">
                                    View all history <span aria-hidden="true" className="ml-1">&rarr;</span>
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* Quick Tips / Info */}
                    <div className="lg:col-span-1">
                        <Card title="Did you know?" className="h-full bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
                            <div className="mt-4 prose prose-sm text-gray-500 dark:text-gray-400">
                                <p>
                                    Planning your holidays early helps the team manage workload better.
                                    You can apply for leave up to 3 months in advance.
                                </p>
                                <h4 className="text-gray-900 dark:text-white font-medium mt-4 mb-2">Upcoming Holidays</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between text-xs">
                                        <span>Christmas Day</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Dec 25</span>
                                    </li>
                                    <li className="flex justify-between text-xs">
                                        <span>New Year's Day</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Jan 01</span>
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
