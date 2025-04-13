'use client';

import { useState, useEffect } from 'react';
import ApiKeyManager from '@/components/ApiKeyManager';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Optionally persist sidebar state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      <main className="flex-1 p-8">
        {/* Gradient Card */}
        <div className="mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1">CURRENT PLAN</div>
              <h2 className="text-2xl font-semibold mb-4">Researcher</h2>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <span>API Usage</span>
                <div className="w-48 h-2 bg-white/20 rounded-full">
                  <div className="w-1/4 h-full bg-white rounded-full"></div>
                </div>
              </div>
              <div className="mt-2 text-sm">5/1,000 Credits</div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Pay as you go</span>
              </div>
            </div>
            <button className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm">
              Manage Plan
            </button>
          </div>
        </div>

        {/* API Key Manager */}
        <ApiKeyManager />
      </main>
    </div>
  );
} 