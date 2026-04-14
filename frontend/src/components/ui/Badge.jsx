import React from 'react';

const variants = {
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    neutral: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
    brand: 'bg-brand-500/10 text-brand-600 border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20',
};

const Badge = ({ children, variant = 'neutral', className = '' }) => {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
