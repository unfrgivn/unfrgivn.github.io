import { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalProvider, useTerminal, type FileSystemNode, type OutputLine } from './TerminalContext';

const ASCII_HEADER = `
 ██████╗ ██████╗  █████╗ ██████╗      █████╗ ███████╗██╗  ██╗
 ██╔══██╗██╔══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔════╝██║  ██║
 ██████╔╝██████╔╝███████║██║  ██║    ███████║███████╗███████║
 ██╔══██╗██╔══██╗██╔══██║██║  ██║    ██╔══██║╚════██║██╔══██║
 ██████╔╝██║  ██║██║  ██║██████╔╝    ██║  ██║███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                                              
 Senior Software Engineer | Platform & Distributed Systems
 ─────────────────────────────────────────────────────────────
 Type 'help' for available commands. Use vim keybindings (j/k/gg/G).
`;

function parseAnsi(text: string): React.ReactNode[] {
  const ansiPattern = /\x1b\[([0-9;]*)m/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let currentColor = '';
  let match;
  let key = 0;

  const colorMap: Record<string, string> = {
    '0': '',
    '1;34': 'text-terminal-cyan',
    '34': 'text-terminal-cyan',
    '1;32': 'text-terminal-green',
    '32': 'text-terminal-green',
    '1;31': 'text-terminal-red',
    '31': 'text-terminal-red',
    '1;33': 'text-terminal-yellow',
    '33': 'text-terminal-yellow',
    '1;35': 'text-terminal-purple',
    '35': 'text-terminal-purple',
  };

  while ((match = ansiPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const segment = text.slice(lastIndex, match.index);
      parts.push(
        currentColor ? <span key={key++} className={currentColor}>{segment}</span> : segment
      );
    }
    currentColor = colorMap[match[1]] || '';
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const segment = text.slice(lastIndex);
    parts.push(
      currentColor ? <span key={key++} className={currentColor}>{segment}</span> : segment
    );
  }

  return parts.length > 0 ? parts : [text];
}

function TerminalOutput({ line }: { line: OutputLine }) {
  const getColorClass = () => {
    switch (line.type) {
      case 'command': return 'text-terminal-cyan';
      case 'error': return 'text-terminal-red';
      case 'system': return 'text-terminal-yellow';
      case 'ascii': return 'text-terminal-purple';
      default: return 'text-terminal-fg';
    }
  };

  const content = line.content.includes('\x1b[') ? parseAnsi(line.content) : line.content;

  return (
    <div className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${getColorClass()}`}>
      {content}
    </div>
  );
}

function TerminalPrompt() {
  const { cwd, executeCommand, navigateHistory, vimMode, setVimMode, isSearching, setIsSearching, searchQuery, setSearchQuery, scrollUp, scrollDown, scrollToTop, scrollToBottom, commandBuffer, setCommandBuffer, fs } = useTerminal();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getCompletions = useCallback((partial: string): string[] => {
    const commands = ['help', 'ls', 'cd', 'cat', 'pwd', 'clear', 'whoami', 'about', 'projects', 'contact'];
    const parts = partial.split(' ');
    
    if (parts.length === 1) {
      return commands.filter(cmd => cmd.startsWith(parts[0]));
    }
    
    if (parts[0] === 'cd' || parts[0] === 'cat' || parts[0] === 'ls') {
      const pathPart = parts.slice(1).join(' ');
      const cwdPath = cwd === '~' ? '' : cwd.replace('~/', '');
      
      let currentNode = fs;
      if (cwdPath) {
        for (const segment of cwdPath.split('/')) {
          if (currentNode.children?.[segment]) {
            currentNode = currentNode.children[segment];
          }
        }
      }
      
      if (currentNode.children) {
        const matches = Object.keys(currentNode.children).filter(name => 
          name.startsWith(pathPart)
        );
        return matches.map(m => `${parts[0]} ${m}${currentNode.children![m].type === 'dir' ? '/' : ''}`);
      }
    }
    
    return [];
  }, [cwd, fs]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isSearching) {
      if (e.key === 'Escape') {
        setIsSearching(false);
        setSearchQuery('');
        inputRef.current?.focus();
      }
      return;
    }

    if (vimMode === 'command') {
      if (e.key === 'Escape') {
        setVimMode('normal');
        setCommandBuffer('');
      } else if (e.key === 'Enter') {
        if (commandBuffer === 'q' || commandBuffer === 'quit') {
          window.location.reload();
        }
        setVimMode('normal');
        setCommandBuffer('');
      } else if (e.key === 'Backspace') {
        setCommandBuffer(commandBuffer.slice(0, -1));
        if (commandBuffer.length <= 1) setVimMode('normal');
      } else if (e.key.length === 1) {
        setCommandBuffer(commandBuffer + e.key);
      }
      return;
    }

    if (vimMode === 'normal' && document.activeElement !== inputRef.current) {
      switch (e.key) {
        case 'j':
          e.preventDefault();
          scrollDown();
          break;
        case 'k':
          e.preventDefault();
          scrollUp();
          break;
        case 'g':
          if (e.shiftKey) {
            e.preventDefault();
            scrollToBottom();
          }
          break;
        case 'G':
          e.preventDefault();
          scrollToBottom();
          break;
        case '/':
          e.preventDefault();
          setIsSearching(true);
          break;
        case ':':
          e.preventDefault();
          setVimMode('command');
          setCommandBuffer('');
          break;
        case 'i':
          e.preventDefault();
          setVimMode('insert');
          inputRef.current?.focus();
          break;
        case 'Escape':
          break;
      }
      return;
    }
  }, [vimMode, isSearching, commandBuffer, scrollUp, scrollDown, scrollToTop, scrollToBottom, setVimMode, setIsSearching, setSearchQuery]);

  useEffect(() => {
    let ggTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastG = 0;

    const handleGG = (e: KeyboardEvent) => {
      if (vimMode === 'normal' && document.activeElement !== inputRef.current) {
        if (e.key === 'g' && !e.shiftKey) {
          const now = Date.now();
          if (now - lastG < 300) {
            scrollToTop();
            lastG = 0;
          } else {
            lastG = now;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleGG);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleGG);
      if (ggTimeout) clearTimeout(ggTimeout);
    };
  }, [handleKeyDown, vimMode, scrollToTop]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const completions = getCompletions(input);
      if (completions.length === 1) {
        setInput(completions[0]);
      } else if (completions.length > 1) {
        const common = completions.reduce((a, b) => {
          let i = 0;
          while (i < a.length && i < b.length && a[i] === b[i]) i++;
          return a.slice(0, i);
        });
        if (common.length > input.length) {
          setInput(common);
        }
      }
    } else if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevCmd = navigateHistory('up');
      setInput(prevCmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCmd = navigateHistory('down');
      setInput(nextCmd);
    } else if (e.key === 'Escape') {
      setVimMode('normal');
      inputRef.current?.blur();
    }
  };

  const handleClick = () => {
    setVimMode('insert');
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2 mt-2" onClick={handleClick}>
      <span className="text-terminal-green font-bold">{cwd}</span>
      <span className="text-terminal-cyan">$</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onFocus={() => setVimMode('insert')}
        className="flex-1 bg-transparent outline-none text-terminal-fg font-mono text-sm caret-terminal-green"
        spellCheck={false}
        autoComplete="off"
        autoFocus
      />
      <span className="text-terminal-comment text-xs">
        [{vimMode.toUpperCase()}]
      </span>
    </div>
  );
}

function TerminalBody() {
  const { output, outputRef, vimMode, commandBuffer, isSearching, searchQuery, setSearchQuery } = useTerminal();

  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-terminal-comment scrollbar-track-transparent"
      >
        <pre className="text-terminal-purple text-xs md:text-sm whitespace-pre font-mono leading-tight mb-4">
          {ASCII_HEADER}
        </pre>
        
        {output.map((line) => (
          <TerminalOutput key={line.id} line={line} />
        ))}
      </div>

      <div className="border-t border-terminal-comment/30 p-4 bg-terminal-bg/80 backdrop-blur">
        {isSearching ? (
          <div className="flex items-center gap-2">
            <span className="text-terminal-yellow">/</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-terminal-fg font-mono text-sm"
              autoFocus
              placeholder="search..."
            />
          </div>
        ) : vimMode === 'command' ? (
          <div className="flex items-center gap-2">
            <span className="text-terminal-yellow">:</span>
            <span className="text-terminal-fg font-mono text-sm">{commandBuffer}</span>
            <span className="animate-pulse">█</span>
          </div>
        ) : (
          <TerminalPrompt />
        )}
      </div>

      <div className="scanlines pointer-events-none" />
    </div>
  );
}

interface TerminalProps {
  fileSystem: FileSystemNode;
}

export default function Terminal({ fileSystem }: TerminalProps) {
  const initialOutput: OutputLine[] = [
    { id: 'welcome', type: 'system', content: 'Welcome to bradash.dev — Interactive Terminal Portfolio', timestamp: Date.now() },
    { id: 'hint', type: 'system', content: "Type 'help' to get started or 'about' to learn more.", timestamp: Date.now() },
  ];

  return (
    <div className="terminal-container h-screen w-screen overflow-hidden bg-terminal-bg text-terminal-fg font-mono">
      <div className="crt-overlay pointer-events-none" />
      <TerminalProvider fileSystem={fileSystem} initialOutput={initialOutput}>
        <TerminalBody />
      </TerminalProvider>
    </div>
  );
}
