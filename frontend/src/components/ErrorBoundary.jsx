import React from 'react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 text-center">
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                                Something went wrong
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                We apologize for the inconvenience. Please try refreshing the page.
                            </p>
                            {this.state.error && (
                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md text-left overflow-auto max-h-40">
                                    <p className="text-xs text-red-800 dark:text-red-200 font-mono">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center space-x-4">
                            <Button onClick={() => window.location.reload()}>
                                Refresh Page
                            </Button>
                            <Button variant="secondary" onClick={() => window.location.href = '/'}>
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
