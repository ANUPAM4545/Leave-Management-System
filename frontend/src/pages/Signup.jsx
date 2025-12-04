import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ROLES } from '../utils/role';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: ROLES.EMPLOYEE,
        first_name: '',
        last_name: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.register(formData);
            addToast('Registration successful! Please login.', 'success');
            navigate('/login');
        } catch (err) {
            addToast('Registration failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-900">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-gray-800/30 backdrop-blur-md shadow-xl z-10">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <div className="h-10 w-10 bg-brand-600 rounded-lg flex items-center justify-center mb-6">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-300">
                            Join your organization's workspace
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Email address</label>
                                <input
                                    type="email"
                                    required
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
                                <div className="relative">
                                    <select
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800/40 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 appearance-none"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="HR">HR</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3 mt-2"
                                isLoading={isLoading}
                            >
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-300">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden lg:block relative w-0 flex-1 bg-brand-900">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-900 opacity-90 mix-blend-multiply"></div>
                <img
                    className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Team collaboration"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-4xl font-bold mb-4">Join the Team</h1>
                    <p className="text-lg text-brand-100 max-w-md">
                        Get started with the best leave management system and streamline your workflow today.
                    </p>
                </div>
            </div>
        </div>
    );
}
