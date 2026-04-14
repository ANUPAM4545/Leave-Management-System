import { motion } from 'framer-motion';

export default function Input({ label, type = 'text', className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {label}
                </label>
            )}
            <motion.input
                whileFocus={{ scale: 1.01 }}
                type={type}
                className="block w-full px-5 py-4 rounded-2xl border-none bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-600 font-medium sm:text-sm"
                {...props}
            />
        </div>
    );
}
