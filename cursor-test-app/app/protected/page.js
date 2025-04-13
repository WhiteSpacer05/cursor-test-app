'use client';

export default function ProtectedPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-4">Protected Content</h1>
          <p className="text-gray-600 mb-6">
            Welcome to the protected area! This is your protected content.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              What&apos;s Next?
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