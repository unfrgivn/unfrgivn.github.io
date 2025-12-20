import { useState, useEffect, useRef } from 'react';

const THEMES = [
  { id: 'latte', name: 'Latte', icon: '☀️', description: 'Light' },
  { id: 'frappe', name: 'Frappé', icon: '🌤️', description: 'Light-Dark' },
  { id: 'macchiato', name: 'Macchiato', icon: '🌙', description: 'Dark' },
  { id: 'mocha', name: 'Mocha', icon: '🌑', description: 'Darker' },
] as const;

type ThemeId = typeof THEMES[number]['id'];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>('macchiato');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('catppuccin-theme') as ThemeId | null;
    if (saved && THEMES.some(t => t.id === saved)) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: ThemeId) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('catppuccin-theme', newTheme);
    setIsOpen(false);
  };

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[2];

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-0.5 bg-ctp-surface0 hover:bg-ctp-surface1 border border-ctp-surface1 rounded text-[10px] text-ctp-text transition-colors cursor-pointer"
        title="Switch theme"
        aria-label="Switch theme"
        aria-expanded={isOpen}
      >
        <span className="text-xs">{currentTheme.icon}</span>
        <span className="hidden sm:inline">{currentTheme.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-ctp-base border border-ctp-surface1 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="py-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  theme === t.id 
                    ? 'bg-ctp-surface1 text-ctp-lavender' 
                    : 'text-ctp-text hover:bg-ctp-surface0'
                }`}
              >
                <span className="text-base">{t.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-ctp-subtext0">{t.description}</div>
                </div>
                {theme === t.id && (
                  <span className="text-ctp-green">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
