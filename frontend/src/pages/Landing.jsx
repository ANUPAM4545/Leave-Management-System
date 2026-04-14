import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    ChartBarSquareIcon,
    ShieldCheckIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Landing() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const features = [
        {
            icon: <CalendarDaysIcon className="w-8 h-8 text-brand-400" />,
            title: "Automated Tracking",
            description: "Seamlessly submit and track leave applications. Say goodbye to messy spreadsheets and emails."
        },
        {
            icon: <UserGroupIcon className="w-8 h-8 text-brand-400" />,
            title: "Manager Workflows",
            description: "A centralized executive queue to approve or reject requests instantly with optional documented feedback."
        },
        {
            icon: <ChartBarSquareIcon className="w-8 h-8 text-brand-400" />,
            title: "Premium Analytics",
            description: "View real-time allowances, used days, and team availability on beautifully rendered interactive charts."
        },
        {
            icon: <ShieldCheckIcon className="w-8 h-8 text-brand-400" />,
            title: "Role-Based Access",
            description: "Secure environments tailored specifically for Employees, Managers, and HR Administrators."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-brand-500/30 overflow-x-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-400/5 rounded-full blur-[150px] pointer-events-none translate-y-1/3"></div>

            {/* Navigation */}
            <nav className="fixed w-full top-0 z-50 glass-dark border-b border-brand-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 animate-gradient">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                            LMS Pro
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                            Features
                        </a>
                        <Link to="/login" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-brand-500/30 text-brand-400 text-sm font-bold transition-all hover:border-brand-500 hover:shadow-glow/20">
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center min-h-[90vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 relative">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/5 backdrop-blur-md mb-8">
                            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                            <span className="text-xs font-black uppercase tracking-widest text-brand-400">The Modern Standard</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-br from-white via-slate-200 to-slate-600 bg-clip-text text-transparent">
                            Elevate Your <br className="hidden md:block"/> Workplace.
                        </h1>
                        
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed">
                            A completely frictionless leave management system designed for scale. Experience beautiful aesthetics, intelligent workflows, and robust security all in one centralized platform.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup" className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-400 text-white font-black uppercase tracking-widest text-sm transition-all hover:scale-105 shadow-glow/30 flex items-center justify-center gap-3">
                                Get Started
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-brand-400 font-bold text-sm hover:text-brand-300 transition-colors uppercase tracking-widest flex items-center justify-center">
                                View Features
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-24 relative z-10 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent tracking-tight">
                            Everything You Need.
                        </h2>
                        <p className="mt-4 text-slate-400 font-medium max-w-xl mx-auto">
                            Designed to eradicate administrative overhead while providing a premium experience for every employee.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="glass-card p-8 flex flex-col items-start hover:-translate-y-2 transition-transform duration-500"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-brand-900/40 border border-brand-500/20 flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="border-t border-slate-800/50 py-8 relative z-10 bg-black/40">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-medium text-slate-600">
                        &copy; {new Date().getFullYear()} LMS Pro. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
