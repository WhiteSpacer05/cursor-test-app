'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isCollapsed, onToggle }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', path: '/dashboards', icon: '🏠' },
    { name: 'My Account', path: '/account', icon: '👤' },
    { name: 'Research Assistant', path: '/assistant', icon: '🔬' },
    { name: 'API Playground', path: '/playground', icon: '🎮' },
    { name: 'Documentation', path: '/docs', icon: '📚' }
  ];

  return (
    <div 
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } h-screen bg-white border-r flex flex-col transition-all duration-300`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/vercel.svg"
            alt="Logo"
            width={24}
            height={24}
            className="dark:invert min-w-6"
          />
          {!isCollapsed && <span className="text-xl font-semibold">Dashboard</span>}
        </Link>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Personal Section */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Personal
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {!isCollapsed && <span>Operational</span>}
        </div>
      </div>
    </div>
  );
} 