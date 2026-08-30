import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'pill' | 'expanded';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  if (variant === 'pill') {
    return (
      <button
        id="theme-toggle-pill"
        onClick={toggleTheme}
        type="button"
        title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        aria-label={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all duration-200 cursor-pointer border select-none ${
          isLight
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 shadow-sm'
            : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
        } ${className}`}
      >
        {isLight ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-blue-400" />
            <span>Dark</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'expanded') {
    return (
      <div 
        id="theme-toggle-expanded"
        className={`flex items-center p-1 rounded-lg border transition-colors ${
          isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0B0F1A] border-slate-800'
        } ${className}`}
      >
        <button
          type="button"
          onClick={() => isLight && toggleTheme()}
          className={`flex-1 py-1 px-2.5 rounded text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            !isLight
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Moon className="w-3 h-3" />
          <span>Dark</span>
        </button>
        <button
          type="button"
          onClick={() => !isLight && toggleTheme()}
          className={`flex-1 py-1 px-2.5 rounded text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isLight
              ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-3 h-3 text-amber-500" />
          <span>Light</span>
        </button>
      </div>
    );
  }

  // Compact variant
  return (
    <button
      id="theme-toggle-compact"
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      aria-label={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      className={`p-1.5 rounded-md border transition-all duration-150 flex items-center justify-center cursor-pointer ${
        isLight
          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 shadow-sm'
          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
      } ${className}`}
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-blue-400 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
