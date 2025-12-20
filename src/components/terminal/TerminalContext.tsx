import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

export interface FileSystemNode {
  type: 'file' | 'dir';
  name: string;
  content?: string;
  children?: Record<string, FileSystemNode>;
}

export interface OutputLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'system' | 'ascii';
  content: string;
  timestamp: number;
}

type VimMode = 'normal' | 'insert' | 'command';

interface TerminalState {
  cwd: string;
  output: OutputLine[];
  commandHistory: string[];
  historyIndex: number;
  vimMode: VimMode;
  searchQuery: string;
  isSearching: boolean;
  commandBuffer: string;
}

interface TerminalContextValue extends TerminalState {
  executeCommand: (cmd: string) => void;
  addOutput: (line: Omit<OutputLine, 'id' | 'timestamp'>) => void;
  clearOutput: () => void;
  navigateHistory: (direction: 'up' | 'down') => string;
  setVimMode: (mode: VimMode) => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (searching: boolean) => void;
  setCommandBuffer: (buffer: string) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollUp: () => void;
  scrollDown: () => void;
  outputRef: React.RefObject<HTMLDivElement>;
  fs: FileSystemNode;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error('useTerminal must be used within TerminalProvider');
  return ctx;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function resolvePath(cwd: string, path: string): string {
  if (path.startsWith('/')) return path;
  if (path === '..') {
    const parts = cwd.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }
  if (path === '.') return cwd;
  
  const parts = cwd.split('/').filter(Boolean);
  for (const segment of path.split('/')) {
    if (segment === '..') parts.pop();
    else if (segment !== '.') parts.push(segment);
  }
  return '/' + parts.join('/');
}

function getNode(fs: FileSystemNode, path: string): FileSystemNode | null {
  if (path === '/' || path === '') return fs;
  const parts = path.split('/').filter(Boolean);
  let current: FileSystemNode | undefined = fs;
  for (const part of parts) {
    if (current?.type !== 'dir' || !current.children?.[part]) return null;
    current = current.children[part];
  }
  return current ?? null;
}

interface TerminalProviderProps {
  children: ReactNode;
  fileSystem: FileSystemNode;
  initialOutput?: OutputLine[];
}

export function TerminalProvider({ children, fileSystem, initialOutput = [] }: TerminalProviderProps) {
  const [state, setState] = useState<TerminalState>({
    cwd: '~',
    output: initialOutput,
    commandHistory: [],
    historyIndex: -1,
    vimMode: 'normal',
    searchQuery: '',
    isSearching: false,
    commandBuffer: '',
  });

  const outputRef = useRef<HTMLDivElement>(null);

  const addOutput = useCallback((line: Omit<OutputLine, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      output: [...prev.output, { ...line, id: generateId(), timestamp: Date.now() }],
    }));
  }, []);

  const clearOutput = useCallback(() => {
    setState(prev => ({ ...prev, output: [] }));
  }, []);

  const executeCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addOutput({ type: 'command', content: `${state.cwd} $ ${trimmed}` });

    setState(prev => ({
      ...prev,
      commandHistory: [...prev.commandHistory, trimmed],
      historyIndex: -1,
    }));

    const [cmd, ...args] = trimmed.split(/\s+/);
    const arg = args.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help': {
        addOutput({
          type: 'output',
          content: `Available commands:
  help              Show this help message
  ls [path]         List directory contents
  cd <path>         Change directory
  cat <file>        Display file contents
  pwd               Print working directory
  clear             Clear terminal
  whoami            Display user info
  about             About Brad Ash
  projects          List all projects
  contact           Contact information

Vim keybindings:
  j/k               Scroll down/up
  gg/G              Jump to top/bottom
  /                 Search
  :q                Clear and reset
  Esc               Exit search/command mode

Navigation:
  ↑/↓               Command history
  Tab               Autocomplete
  Enter             Execute command`,
        });
        break;
      }

      case 'clear': {
        clearOutput();
        break;
      }

      case 'pwd': {
        addOutput({ type: 'output', content: state.cwd });
        break;
      }

      case 'whoami': {
        addOutput({ type: 'output', content: 'brad.ash' });
        break;
      }

      case 'about': {
        addOutput({
          type: 'output',
          content: `
┌─────────────────────────────────────────────────────────────┐
│  BRAD ASH                                                   │
│  Senior Software Engineer                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Specializing in:                                           │
│  • Platform Engineering & Cloud Infrastructure              │
│  • Distributed Systems & Event-Driven Architecture          │
│  • Developer Experience & Internal Tooling                  │
│                                                             │
│  I build scalable systems that developers love to use.      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Type 'projects' to see my work or 'contact' for ways to reach me.`,
        });
        break;
      }

      case 'contact': {
        addOutput({
          type: 'output',
          content: `
┌─────────────────────────────────────────────────────────────┐
│  CONTACT                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GitHub    https://github.com/unfrgivn                      │
│  Email     brad.ash@example.com                             │
│  LinkedIn  linkedin.com/in/bradash                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘`,
        });
        break;
      }

      case 'ls': {
        const targetPath = arg ? resolvePath(state.cwd.replace('~', ''), arg) : state.cwd.replace('~', '') || '/';
        const node = getNode(fileSystem, targetPath);
        
        if (!node) {
          addOutput({ type: 'error', content: `ls: cannot access '${arg}': No such file or directory` });
        } else if (node.type === 'file') {
          addOutput({ type: 'output', content: node.name });
        } else {
          const entries = Object.entries(node.children || {});
          if (entries.length === 0) {
            addOutput({ type: 'output', content: '' });
          } else {
            const formatted = entries.map(([name, n]) => 
              n.type === 'dir' ? `\x1b[1;34m${name}/\x1b[0m` : name
            ).join('  ');
            addOutput({ type: 'output', content: formatted });
          }
        }
        break;
      }

      case 'cd': {
        if (!arg || arg === '~') {
          setState(prev => ({ ...prev, cwd: '~' }));
        } else {
          const targetPath = resolvePath(state.cwd.replace('~', '') || '/', arg);
          const node = getNode(fileSystem, targetPath);
          
          if (!node) {
            addOutput({ type: 'error', content: `cd: no such file or directory: ${arg}` });
          } else if (node.type !== 'dir') {
            addOutput({ type: 'error', content: `cd: not a directory: ${arg}` });
          } else {
            const newCwd = targetPath === '/' ? '~' : '~' + targetPath;
            setState(prev => ({ ...prev, cwd: newCwd }));
          }
        }
        break;
      }

      case 'cat': {
        if (!arg) {
          addOutput({ type: 'error', content: 'cat: missing file operand' });
        } else {
          const targetPath = resolvePath(state.cwd.replace('~', '') || '/', arg);
          const node = getNode(fileSystem, targetPath);
          
          if (!node) {
            addOutput({ type: 'error', content: `cat: ${arg}: No such file or directory` });
          } else if (node.type === 'dir') {
            addOutput({ type: 'error', content: `cat: ${arg}: Is a directory` });
          } else {
            addOutput({ type: 'output', content: node.content || '' });
          }
        }
        break;
      }

      case 'projects': {
        const projectsNode = getNode(fileSystem, '/projects');
        if (projectsNode?.type === 'dir' && projectsNode.children) {
          const projects = Object.keys(projectsNode.children).filter(name => 
            projectsNode.children![name].type === 'dir'
          );
          addOutput({
            type: 'output',
            content: `
┌─────────────────────────────────────────────────────────────┐
│  PROJECTS                                                   │
├─────────────────────────────────────────────────────────────┤
${projects.map(p => `│  • ${p.padEnd(55)}│`).join('\n')}
└─────────────────────────────────────────────────────────────┘

Use 'cd projects/<name>' then 'cat README.md' for details.`,
          });
        } else {
          addOutput({ type: 'error', content: 'No projects found.' });
        }
        break;
      }

      default: {
        addOutput({ type: 'error', content: `command not found: ${cmd}. Type 'help' for available commands.` });
      }
    }

    setTimeout(() => {
      outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
    }, 10);
  }, [state.cwd, fileSystem, addOutput, clearOutput]);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string => {
    let newIndex = state.historyIndex;
    if (direction === 'up') {
      newIndex = Math.min(state.historyIndex + 1, state.commandHistory.length - 1);
    } else {
      newIndex = Math.max(state.historyIndex - 1, -1);
    }
    setState(prev => ({ ...prev, historyIndex: newIndex }));
    return newIndex >= 0 ? state.commandHistory[state.commandHistory.length - 1 - newIndex] : '';
  }, [state.historyIndex, state.commandHistory]);

  const setVimMode = useCallback((mode: VimMode) => {
    setState(prev => ({ ...prev, vimMode: mode }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setIsSearching = useCallback((searching: boolean) => {
    setState(prev => ({ ...prev, isSearching: searching }));
  }, []);

  const setCommandBuffer = useCallback((buffer: string) => {
    setState(prev => ({ ...prev, commandBuffer: buffer }));
  }, []);

  const scrollToTop = useCallback(() => {
    outputRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
  }, []);

  const scrollUp = useCallback(() => {
    outputRef.current?.scrollBy({ top: -100, behavior: 'smooth' });
  }, []);

  const scrollDown = useCallback(() => {
    outputRef.current?.scrollBy({ top: 100, behavior: 'smooth' });
  }, []);

  return (
    <TerminalContext.Provider
      value={{
        ...state,
        executeCommand,
        addOutput,
        clearOutput,
        navigateHistory,
        setVimMode,
        setSearchQuery,
        setIsSearching,
        setCommandBuffer,
        scrollToTop,
        scrollToBottom,
        scrollUp,
        scrollDown,
        outputRef: outputRef as React.RefObject<HTMLDivElement>,
        fs: fileSystem,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}
