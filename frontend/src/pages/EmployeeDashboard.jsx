import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusIcon, ListBulletIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';

export default function EmployeeDashboard() {
    const { user } = useAuth();

    // Get display name - prefer full name, fallback to username
    const displayName = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.first_name || user?.username || 'User';

    return (
        <Layout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {displayName}!</h2>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Here's what's happening with your leaves today.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card
                    title="Apply for Leave"
                    subtitle="Request a new leave of absence."
                    className="hover:border-indigo-200"
                >
                    <div className="mt-4">
                        <Link to="/create-leave">
                            <Button className="w-full justify-center">
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Apply Now
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card
                    title="My Requests"
                    subtitle="View status of your leave requests."
                    className="hover:border-indigo-200"
                >
                    <div className="mt-4">
                        <Link to="/my-requests">
                            <Button variant="secondary" className="w-full justify-center">
                                <ListBulletIcon className="w-5 h-5 mr-2" />
                                View History
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card title="Leave Balance" subtitle="Remaining leaves for this year.">
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold text-indigo-600">12</span>
                        <span className="ml-1 text-gray-500">days</span>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
