export default function Input({ label, type = 'text', className = '', ...props }) {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <input
                type={type}
                className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                {...props}
            />
        </div>
    );
}
