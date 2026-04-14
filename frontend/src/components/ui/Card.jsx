import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', title, action, hover = true }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {}}
            className={`bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl shadow-premium border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all duration-300 ${className}`}
        >
            {(title || action) && (
                <div className="flex justify-between items-center mb-6">
                    {title && <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </motion.div>
    );
};

export default Card;
