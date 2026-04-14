import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

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
        <div className="min-h-screen flex bg-slate-950 selection:bg-brand-500/30">
            {/* Form Section */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:flex-none lg:px-24 xl:px-32 relative z-20 bg-slate-950/60 backdrop-blur-2xl border-r border-slate-800/50"
            >
                <div className="mx-auto w-full max-w-sm lg:w-[26rem]">
                    <div className="mb-12">
                        <div className="h-14 w-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-500/20">
                            <SparklesIcon className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-3">Welcome back</h2>
                        <p className="text-slate-400 font-medium">
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Username</label>
                            <input
                                type="text"
                                required
                                className="block w-full px-5 py-4 rounded-2xl border-none bg-slate-800/50 text-white focus:ring-2 focus:ring-brand-500 transition-all duration-300 placeholder-slate-600 font-medium"
                                placeholder="your_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-xs font-bold text-brand-500 hover:text-brand-400 transition-colors uppercase tracking-widest">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full px-5 py-4 rounded-2xl border-none bg-slate-800/50 text-white focus:ring-2 focus:ring-brand-500 transition-all duration-300 placeholder-slate-600 font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 text-base tracking-wide"
                            variant="primary"
                            isLoading={isLoading}
                        >
                            SIGN IN <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </Button>
                    </form>

                    <div className="mt-10 text-center border-t border-slate-800/50 pt-8">
                        <p className="text-sm text-slate-400 font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-bold text-brand-500 hover:text-brand-400 transition-colors">
                                Join the team
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Cinematic Background */}
            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/20 z-10 backdrop-blur-[1px]"></div>
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="h-full w-full"
                >
                    <img
                        className="h-full w-full object-cover"
                        src="/login_bg_v2.png"
                        alt="Cinematic background"
                    />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12 lg:p-20 z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="w-full max-w-2xl px-4"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 uppercase tracking-tight">
                            Modernizing <br />
                            <span className="text-brand-500">Workspace</span> <br />
                            Efficiency.
                        </h1>
                        <p className="text-xl text-slate-300 max-w-lg mx-auto font-medium leading-relaxed opacity-80 mb-8">
                            Seamless leave management designed for the modern era. Experience clarity, speed, and premium design.
                        </p>
                        <div className="flex justify-center gap-12">
                            <div>
                                <p className="text-3xl font-black text-white">99%</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Satisfaction</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">24/7</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Availability</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            </div>
        </div>
    );
}
