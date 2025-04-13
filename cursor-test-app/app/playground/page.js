'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function APIPlayground() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple delay to simulate processing
    setTimeout(() => {
      router.push('/protected');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Playground</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your API key here"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || !apiKey.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all ${
                  isLoading || !apiKey.trim()
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit API Key</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setApiKey('')}
                disabled={isLoading || !apiKey}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  isLoading || !apiKey
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 