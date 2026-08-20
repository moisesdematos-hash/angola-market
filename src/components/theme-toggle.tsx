'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Alternar Tema"
        className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
      >
        <Sun className="h-5 w-5 opacity-0" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
      aria-label="Alternar Tema"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-all" />
      )}
    </button>
  );
}
