'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if API key exists
    const apiKey = Cookies.get('validApiKey');
    if (!apiKey) {
      router.replace('/playground');
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('validApiKey');
    router.replace('/playground');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Protected Content</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <p className="text-gray-600 mb-6">
            Welcome to the protected area! Your API key has been successfully validated.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              What's Next?
            </h2>
            <p className="text-blue-600">
              You can now access all the protected features and endpoints. This page serves as a placeholder for your actual protected content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 