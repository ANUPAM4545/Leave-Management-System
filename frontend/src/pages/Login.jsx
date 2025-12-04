import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await api.login(username, password);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            // Get user role
            const user = await api.getMe();
            localStorage.setItem('role', user.role);

            addToast('Login successful!', 'success');
            navigate('/dashboard');
        } catch (err) {
            addToast('Invalid credentials', 'error');
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-300">
                            Please sign in to your account
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-200">Password</label>
                                    <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3"
                                isLoading={isLoading}
                            >
                                Sign in
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-300">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
                                    Create a new account
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
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Office background"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-4xl font-bold mb-4">Manage Leaves Efficiently</h1>
                    <p className="text-lg text-brand-100 max-w-md">
                        Streamline your organization's leave management process with our modern, easy-to-use platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
