'use client';

export default function Snackbar({ message, isVisible, onClose, type = 'default', position = 'top' }) {
  if (!isVisible) return null;

  const positionClasses = {
    top: 'top-4',
    bottom: 'bottom-4'
  };

  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    default: 'bg-gray-800'
  };

  return (
    <div className={`fixed ${positionClasses[position]} right-4 z-50 animate-fade-in`}>
      <div className={`${typeClasses[type]} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
        {type === 'success' && <span>✓</span>}
        {type === 'error' && <span>⚠</span>}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Add animation keyframes to your global CSS or tailwind.config.js
// @keyframes fade-in {
//   from { opacity: 0; transform: translateY(1rem); }
//   to { opacity: 1; transform: translateY(0); }
// } 