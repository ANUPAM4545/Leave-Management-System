import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { ROLES } from '../utils/role';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { SparklesIcon, ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

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
            addToast('Registration successful! Welcome aboard.', 'success');
            navigate('/login');
        } catch (err) {
            addToast('Registration failed. Please check your details.', 'error');
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
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                            <SparklesIcon className="h-4 w-4 mr-2" />
                            Future of Work
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-3">Create Account</h2>
                        <p className="text-slate-400 font-medium">
                            Join your organization's digital workspace today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                placeholder="Jane"
                            />
                            <Input
                                label="Last Name"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                placeholder="Doe"
                            />
                        </div>

                        <Input
                            label="Corporate Email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="jane@company.com"
                        />

                        <Input
                            label="Username"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="janedoe_sys"
                        />

                        <Input
                            label="Access Password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Designated Role</label>
                            <div className="relative group">
                                <select
                                    className="block w-full px-5 py-4 rounded-2xl border-none bg-slate-800/50 text-white focus:ring-2 focus:ring-brand-500 transition-all duration-300 appearance-none cursor-pointer font-medium"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="EMPLOYEE">Standard Employee</option>
                                    <option value="MANAGER">Operational Manager</option>
                                    <option value="HR">HR Administrator</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 group-hover:text-brand-500 transition-colors">
                                    <UserPlusIcon className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full py-5 mt-4 group shadow-xl shadow-brand-500/10"
                            isLoading={isLoading}
                        >
                            INITIALIZE ACCOUNT
                            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-400 font-medium">
                            Already a member?{' '}
                            <Link to="/login" className="font-black text-brand-500 hover:text-brand-400 transition-colors uppercase tracking-widest text-xs">
                                Sign in
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
                        src="/signup_bg.png"
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
                            Empowering <br />
                            <span className="text-brand-500">Workspace</span> <br />
                            Infinity.
                        </h1>
                        <p className="text-xl text-slate-300 max-w-lg mx-auto font-medium leading-relaxed opacity-80 mb-8">
                            A new era of leave management. Effortless, intelligent, and designed for the modern team.
                        </p>
                        <div className="flex justify-center gap-12">
                            <div>
                                <p className="text-3xl font-black text-white">100%</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Automated</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">0.2s</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Response</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">Global</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Synchronized</p>
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
