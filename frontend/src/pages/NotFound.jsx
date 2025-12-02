import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';

export default function NotFound() {
    return (
        <Layout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">404</h1>
                <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-md">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <div className="mt-8">
                    <Link to="/">
                        <Button size="lg">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
