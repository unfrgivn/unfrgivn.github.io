import { useState, useEffect, useCallback, useRef } from 'react';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'page' | 'project' | 'action';
  href?: string;
  action?: () => void;
  icon?: string;
}

const STATIC_COMMANDS: CommandItem[] = [
  { id: 'home', title: 'Home', category: 'page', href: '/', icon: '🏠' },
  { id: 'about', title: 'About', category: 'page', href: '/projects#about', icon: '👤' },
  { id: 'projects', title: 'Projects', category: 'page', href: '/projects', icon: '📁' },
];

interface Props {
  projects?: Array<{ slug: string; title: string; company?: string }>;
}

export default function CommandPalette({ projects = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allCommands: CommandItem[] = [
    ...STATIC_COMMANDS,
    ...projects.map(p => ({
      id: `project-${p.slug}`,
      title: p.title,
      subtitle: p.company,
      category: 'project' as const,
      href: `/projects#${p.slug}`,
      icon: '📄',
    })),
  ];

  const filteredCommands = query
    ? allCommands.filter(cmd => {
        const searchText = `${cmd.title} ${cmd.subtitle || ''}`.toLowerCase();
        return query.toLowerCase().split(' ').every(term => searchText.includes(term));
      })
    : allCommands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll('button');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          if (selected.href) {
            window.location.href = selected.href;
          } else if (selected.action) {
            selected.action();
          }
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  }, [filteredCommands, selectedIndex]);

  const handleSelect = (cmd: CommandItem) => {
    if (cmd.href) {
      window.location.href = cmd.href;
    } else if (cmd.action) {
      cmd.action();
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-ctp-crust/80 backdrop-blur-sm flex items-start justify-center pt-4 md:pt-[20vh] z-[100]"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-xl mx-4 md:mx-0 bg-ctp-base border border-ctp-surface1 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ctp-surface1">
          <span className="text-ctp-subtext0">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages and projects..."
            className="flex-1 bg-transparent text-ctp-text placeholder-ctp-subtext0 outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="px-2 py-0.5 text-xs bg-ctp-surface0 text-ctp-subtext0 rounded font-mono border border-ctp-surface1">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-12 text-center text-ctp-subtext0">
              No results found
            </div>
          ) : (
            <div className="py-2">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-ctp-surface1 text-ctp-lavender'
                      : 'text-ctp-text hover:bg-ctp-surface0'
                  }`}
                >
                  <span className="text-xl w-6 text-center">{cmd.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{cmd.title}</div>
                    {cmd.subtitle && (
                      <div className="text-xs text-ctp-subtext0 truncate mt-0.5">{cmd.subtitle}</div>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    cmd.category === 'page' ? 'bg-ctp-blue/15 text-ctp-blue' :
                    cmd.category === 'project' ? 'bg-ctp-green/15 text-ctp-green' :
                    'bg-ctp-mauve/15 text-ctp-mauve'
                  }`}>
                    {cmd.category}
                  </span>
                  {index === selectedIndex && (
                     <span className="text-ctp-subtext0 text-sm">↵</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-ctp-surface1 text-xs text-ctp-subtext0 flex gap-4 bg-ctp-mantle/50">
          <span className="flex items-center gap-1"><kbd className="bg-ctp-surface0 px-1 rounded border border-ctp-surface1 font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-ctp-surface0 px-1 rounded border border-ctp-surface1 font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1"><kbd className="bg-ctp-surface0 px-1 rounded border border-ctp-surface1 font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
