'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 text-center px-4">
      <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle size={48} className="text-red-500" />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-gray-800" role="alert">
          Oh no, something went wrong!
        </h2>

        <p className="mt-4 text-gray-600">
          Our kitchen seems to have a little hiccup. We've been notified and are looking into it.
          Please try again in a moment.
        </p>

        <div className="mt-8">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Error Code: {error.digest || 'Client Error'}
        </p>
      </div>
    </div>
  );
}
