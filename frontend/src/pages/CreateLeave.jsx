import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Apply for Leave</h2>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Submit a new leave request for approval.</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Type</label>
                            <select
                                className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                                value={formData.leave_type_id}
                                onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })}
                                required
                            >
                                <option value="">Select a type</option>
                                {leaveTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                            <textarea
                                className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                                rows="4"
                                required
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" isLoading={isLoading}>
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
}
