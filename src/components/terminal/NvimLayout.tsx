import { useState, useEffect, useMemo } from 'react';

type VimMode = 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
  content?: any;
  path: string;
}

interface NvimLayoutProps {
  projects: any[];
}

function parseMarkdown(md: string): string {
  if (!md) return '';
  
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[huplo])/gm, (match, offset, str) => {
      const before = str.slice(0, offset);
      if (before.endsWith('</h1>') || before.endsWith('</h2>') || before.endsWith('</h3>') || 
          before.endsWith('</ul>') || before.endsWith('</li>') || before.endsWith('<hr />') ||
          before.endsWith('</p>') || before.endsWith('<p>')) {
        return match;
      }
      return match;
    });
  
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  html = html.replace(/<p><\/p>/g, '').replace(/<p>\s*<h/g, '<h').replace(/<\/h(\d)>\s*<\/p>/g, '</h$1>');
  
  return html;
}

export default function NvimLayout({ projects }: NvimLayoutProps) {
  const [mode, setMode] = useState<VimMode>('NORMAL');
  const [activePane, setActivePane] = useState<'tree' | 'content'>('tree');
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [openFileId, setOpenFileId] = useState<string>('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [showHelp, setShowHelp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [showTechFilter, setShowTechFilter] = useState(false);
  const [activeTechFilters, setActiveTechFilters] = useState<string[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allTechTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => {
      p.data?.tech?.forEach((t: string) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [projects]);
  
  useEffect(() => {
    const tree: FileNode[] = [
      {
        id: 'root-projects',
        name: 'projects',
        type: 'folder',
        path: '/projects',
        isOpen: true,
        children: projects.map(p => ({
          id: `project-${p.slug}`,
          name: p.slug,
          type: 'file',
          path: `/projects/${p.slug}`,
          content: p
        }))
      },
      {
        id: 'root-about',
        name: 'about.md',
        type: 'file',
        path: '/about.md',
        content: { 
          data: { 
            title: 'About Me', 
            role: 'Senior Engineer',
            company: 'Self',
            tech: ['React', 'TypeScript', 'Node.js', 'Rust', 'Go'],
            domains: ['Frontend', 'Backend', 'DevOps'],
            summary: "I'm a designer-turned-developer with a passion for building beautiful, functional software.",
            icon: ''
          },
          body: "I build software that matters. With a background in design and years of engineering experience, I bridge the gap between aesthetics and functionality."
        }
      },
      {
        id: 'root-contact',
        name: 'contact.md',
        type: 'file',
        path: '/contact.md',
        content: {
          data: {
            title: 'Contact',
            role: 'Human',
            summary: 'Get in touch',
            icon: ''
          },
          body: "Find me on GitHub at github.com/unfrgivn or email me."
        }
      }
    ];
    
    setFileTree(tree);
    
    if (tree[0].children && tree[0].children.length > 0) {
      setSelectedFileId(tree[0].children[0].id);
    } else {
      setSelectedFileId(tree[0].id);
    }
  }, [projects]);

  const [lastKey, setLastKey] = useState<{key: string, time: number} | null>(null);
  const [command, setCommand] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastEscTime, setLastEscTime] = useState<number>(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'COMMAND') {
        if (e.key === 'Enter') {
          if (isSearching) {
             setIsSearching(false);
             setMode('NORMAL');
          } else {
            if (command === 'q' || command === 'q!' || command === 'wq') {
              window.location.href = '/';
              return;
            }
            setCommand('');
            setMode('NORMAL');
          }
        } else if (e.key === 'Escape') {
          setMode('NORMAL');
          setCommand('');
          setSearchQuery('');
          setIsSearching(false);
        } else if (e.key === 'Backspace') {
          if (isSearching) {
             setSearchQuery(prev => prev.slice(0, -1));
          } else {
             setCommand(prev => prev.slice(0, -1));
          }
        } else if (e.key.length === 1) {
          if (isSearching) {
             setSearchQuery(prev => prev + e.key);
          } else {
             setCommand(prev => prev + e.key);
          }
        }
        return;
      }

      if (['j', 'k', 'h', 'l', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      }
      
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
          return;
        }

        if (mode === 'NORMAL') {
          const now = Date.now();
          if (now - lastEscTime < 500) {
            window.location.href = '/';
            return;
          }
          setLastEscTime(now);
        } else {
          setMode('NORMAL');
        }
        return;
      }

      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        window.location.href = '/';
        return;
      }
      
      if (e.key === 'i' && mode === 'NORMAL') {
        setMode('INSERT');
        return;
      }
      
      if (e.key === 'v' && mode === 'NORMAL') {
        setMode('VISUAL');
        return;
      }

      if (e.ctrlKey && e.key === 'w') {
        return;
      }
      
      if (e.ctrlKey && e.key === 'h') {
        setActivePane('tree');
        return;
      }
      
      if (e.ctrlKey && e.key === 'l') {
        setActivePane('content');
        return;
      }

      if (e.key === '?' && mode === 'NORMAL') {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      if (mode !== 'NORMAL') return;

      if (activePane === 'tree') {
        handleTreeNavigation(e.key);
      } 
      else if (activePane === 'content') {
        handleContentNavigation(e.key);
      }
      
      if (e.key === ':' && mode === 'NORMAL') {
        setMode('COMMAND');
        setCommand('');
        return;
      }

      if (e.key === '/' && mode === 'NORMAL') {
        setMode('COMMAND');
        setIsSearching(true);
        setSearchQuery('');
        e.preventDefault(); 
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, activePane, fileTree, selectedFileId, command, isSearching, searchQuery, lastKey, lastEscTime]);

  const hasMatch = (nodes: FileNode[], query: string): boolean => {
    return nodes.some(n => 
      n.name.toLowerCase().includes(query.toLowerCase()) || 
      (n.children && hasMatch(n.children, query))
    );
  };

  const getFilteredNodes = (nodes: FileNode[]): FileNode[] => {
    if (!searchQuery && activeTechFilters.length === 0) return nodes;
    
    return nodes.reduce<FileNode[]>((acc, node) => {
      let matchesTech = true;
      if (activeTechFilters.length > 0 && node.type === 'file') {
        if (node.content?.data?.tech) {
          matchesTech = node.content.data.tech.some((t: string) => activeTechFilters.includes(t));
        }
      }

      let matchesSearch = true;
      if (searchQuery) {
        matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      let filteredChildren: FileNode[] = [];
      let childrenMatch = false;
      
      if (node.children) {
        filteredChildren = getFilteredNodes(node.children);
        if (filteredChildren.length > 0) {
          childrenMatch = true;
        }
      }

      if (node.type === 'folder') {
        const shouldShowFolder = activeTechFilters.length > 0 
          ? childrenMatch 
          : (childrenMatch || matchesSearch);

        if (shouldShowFolder) {
          const newNode = { ...node, children: filteredChildren };
          newNode.isOpen = true; 
          acc.push(newNode);
        }
      } else {
        if (matchesTech && matchesSearch) {
          acc.push(node);
        }
      }
      
      return acc;
    }, []);
  };

  const handleTreeNavigation = (key: string) => {
    const filteredTree = getFilteredNodes(fileTree);
    
    const getVisibleNodes = (nodes: FileNode[]): FileNode[] => {
      let visible: FileNode[] = [];
      nodes.forEach(node => {
        visible.push(node);
        if (node.type === 'folder' && node.isOpen && node.children) {
          visible = visible.concat(getVisibleNodes(node.children));
        }
      });
      return visible;
    };

    const visibleNodes = getVisibleNodes(filteredTree);
    const currentIndex = visibleNodes.findIndex(n => n.id === selectedFileId);

    if (key === 't' && mode === 'NORMAL' && activePane === 'tree') {
      setShowTechFilter(prev => !prev);
      return;
    }

    if (key === 'j' || key === 'ArrowDown') {
      if (currentIndex < visibleNodes.length - 1) {
        setSelectedFileId(visibleNodes[currentIndex + 1].id);
      }
    } else if (key === 'k' || key === 'ArrowUp') {
      if (currentIndex > 0) {
        setSelectedFileId(visibleNodes[currentIndex - 1].id);
      }
    } else if (key === 'Enter' || key === 'l' || key === 'ArrowRight') {
      const node = visibleNodes[currentIndex];
      if (node.type === 'folder') {
        toggleFolder(node.id);
      } else {
        setOpenFileId(node.id);
        setActivePane('content');
      }
    } else if (key === 'h' || key === 'ArrowLeft') {
      const node = visibleNodes[currentIndex];
      if (node.type === 'folder' && node.isOpen) {
        toggleFolder(node.id);
      } else {
        const parentPath = node.path.split('/').slice(0, -1).join('/');
        const parent = visibleNodes.find(n => n.path === parentPath);
        if (parent) {
          setSelectedFileId(parent.id);
        }
      }
    } else if (key === 'g') {
      const now = Date.now();
      if (lastKey && lastKey.key === 'g' && now - lastKey.time < 500) {
        if (visibleNodes.length > 0) setSelectedFileId(visibleNodes[0].id);
        setLastKey(null);
      } else {
        setLastKey({ key: 'g', time: now });
      }
    } else if (key === 'G') {
      if (visibleNodes.length > 0) setSelectedFileId(visibleNodes[visibleNodes.length - 1].id);
    } else {
       setLastKey({ key, time: Date.now() });
    }
  };

  const handleContentNavigation = (key: string) => {
    const content = document.getElementById('main-content');
    if (!content) return;

    if (key === 'j' || key === 'ArrowDown') {
      content.scrollTop += 24;
      setCursorPos(prev => ({ ...prev, line: prev.line + 1 }));
    } else if (key === 'k' || key === 'ArrowUp') {
      content.scrollTop -= 24;
      setCursorPos(prev => ({ ...prev, line: Math.max(1, prev.line - 1) }));
    } else if (key === 'g') {
       const now = Date.now();
       if (lastKey && lastKey.key === 'g' && now - lastKey.time < 500) {
         content.scrollTop = 0;
         setCursorPos({ line: 1, col: 1 });
         setLastKey(null);
       } else {
         setLastKey({ key: 'g', time: now });
       }
    } else if (key === 'G') {
      content.scrollTop = content.scrollHeight;
      setCursorPos(prev => ({ ...prev, line: 100 }));
    } else {
       setLastKey({ key, time: Date.now() });
    }
  };

  const toggleFolder = (id: string) => {
    const toggleNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };
    setFileTree(toggleNode(fileTree));
  };

  const renderTreeNodes = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => {
      const isSelected = node.id === selectedFileId;
      const isOpenFile = node.id === openFileId;
      
      return (
        <div key={node.id}>
          <div 
            className={`
              flex items-center px-2 py-0.5 cursor-pointer font-mono text-sm
              ${isSelected ? 'bg-ctp-surface1 text-ctp-text' : 'text-ctp-overlay2'}
              ${isOpenFile && !isSelected ? 'text-ctp-blue font-bold' : ''}
            `}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => {
              setSelectedFileId(node.id);
              if (node.type === 'file') {
                setOpenFileId(node.id);
                if (isMobile) setActivePane('content');
              } else {
                toggleFolder(node.id);
              }
            }}
          >
            <span className="mr-2 w-4 text-center">
              {node.type === 'folder' ? (
                <span className="text-ctp-blue">
                  {node.isOpen ? '󰝰' : '󰉋'}
                </span>
              ) : (
                <span className="text-ctp-mauve">
                  󰈙
                </span>
              )}
            </span>
            <span>{node.name}</span>
            {isOpenFile && <span className="ml-auto text-ctp-green text-xs">●</span>}
          </div>
          {node.type === 'folder' && node.isOpen && node.children && (
            <div>{renderTreeNodes(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return '󰛦';
    if (name.endsWith('.css')) return '󰔶';
    if (name.endsWith('.json')) return '';
    if (name.endsWith('.md')) return '';
    return '';
  };

  const getFileIconColor = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return 'text-ctp-blue';
    if (name.endsWith('.css')) return 'text-ctp-blue';
    if (name.endsWith('.json')) return 'text-ctp-yellow';
    if (name.endsWith('.md')) return 'text-ctp-mauve';
    return 'text-ctp-text';
  };

  const getActiveFile = () => {
    const findFile = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === (openFileId || selectedFileId)) return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findFile(fileTree);
  };

  const activeFile = getActiveFile();

  return (
    <div className="flex flex-col h-screen bg-ctp-base text-ctp-text font-mono overflow-hidden select-none p-2 md:p-4">
      <div className="flex flex-col flex-1 border border-ctp-surface1 rounded-lg shadow-2xl overflow-hidden relative crt-curve">
        <div className="scanlines pointer-events-none"></div>
        
        <div className="flex justify-between items-center bg-ctp-mantle border-b border-ctp-surface1 px-3 py-1 text-xs text-ctp-subtext1">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-ctp-red"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-ctp-yellow"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-ctp-green"></div>
            </div>
            <span className="ml-2 font-bold opacity-75">nvim — {activeFile?.path || 'portfolio'}</span>
          </div>
          <div className="flex items-center gap-4">
            {isMobile && (
              <button 
                className="px-2 py-0.5 bg-ctp-surface0 rounded border border-ctp-surface1 text-ctp-blue font-bold"
                onClick={() => setActivePane(activePane === 'tree' ? 'content' : 'tree')}
              >
                {activePane === 'tree' ? 'View File' : 'View Tree'}
              </button>
            )}
            <div className="opacity-50 hidden sm:block">[+]</div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          <div className={`w-full md:w-80 flex flex-col border-r border-ctp-surface1 bg-ctp-mantle/50 ${activePane === 'tree' ? 'brightness-110 flex' : 'brightness-90 opacity-80 hidden md:flex'}`}>
            <div className="px-3 py-2 text-xs font-bold text-ctp-blue uppercase tracking-wider border-b border-ctp-surface1 mb-1">
              File Explorer
            </div>
            {showTechFilter && (
              <div className="px-2 py-2 border-b border-ctp-surface1 bg-ctp-surface0/30">
                <div className="text-xs text-ctp-subtext0 mb-2 flex items-center justify-between">
                  <span>Filter by Tech</span>
                  {activeTechFilters.length > 0 && (
                    <button 
                      onClick={() => setActiveTechFilters([])}
                      className="text-ctp-red hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {allTechTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveTechFilters(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                        activeTechFilters.includes(tag)
                          ? 'bg-ctp-blue text-ctp-base'
                          : 'bg-ctp-surface1 text-ctp-subtext0 hover:bg-ctp-surface2'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto py-1 scrollbar-hide">
              {renderTreeNodes(getFilteredNodes(fileTree))}
            </div>
          </div>

          <div 
            id="main-content"
            className={`flex-1 flex flex-col bg-ctp-base overflow-y-auto relative outline-none ${activePane === 'content' ? 'flex' : 'opacity-90 hidden md:flex'}`}
            tabIndex={0}
          >
            {activeFile && activeFile.content ? (
              <div key={activeFile.id} className="p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 slide-in-from-bottom-2">
                <div className="mb-8 border-b border-ctp-surface1 pb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-ctp-mauve mb-2 tracking-tight terminal-glow">
                    <span className="text-ctp-overlay1 mr-2 font-light">#</span>
                    {activeFile.content.data?.title || activeFile.name}
                  </h1>
                  {activeFile.content.data?.role && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-ctp-subtext0 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <span className="text-ctp-blue">@</span> {activeFile.content.data.role}
                      </span>
                      {activeFile.content.data.company && (
                        <span className="flex items-center gap-1">
                          <span className="text-ctp-peach">🏢</span> {activeFile.content.data.company}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-6 text-ctp-text">
                  {activeFile.content.data?.summary && (
                    <div className="p-4 border-l-2 border-ctp-blue bg-ctp-surface0/30 italic text-ctp-subtext0">
                      {activeFile.content.data.summary}
                    </div>
                  )}

                  {activeFile.content.data?.tech && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-ctp-blue mb-3 flex items-center">
                        <span className="text-ctp-overlay1 mr-2 font-light">##</span>Tech Stack
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {activeFile.content.data.tech.map((t: string) => (
                          <span key={t} className="px-2.5 py-1 bg-ctp-surface0/80 text-ctp-teal text-sm rounded-md border border-ctp-surface1 hover:border-ctp-teal/50 hover:shadow-[0_0_10px_rgba(139,213,202,0.2)] transition-all duration-300 cursor-default">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="prose prose-invert prose-p:text-ctp-text prose-headings:text-ctp-mauve prose-a:text-ctp-blue max-w-none 
                    prose-headings:font-bold 
                    prose-h1:text-3xl prose-h1:text-ctp-mauve prose-h1:border-b prose-h1:border-ctp-mauve/20 prose-h1:pb-2 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:text-ctp-blue prose-h2:border-l-4 prose-h2:border-ctp-blue prose-h2:pl-4 prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:text-ctp-lavender prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-8
                    prose-p:leading-relaxed prose-p:mb-4 prose-p:text-lg
                    prose-strong:text-ctp-text prose-strong:font-extrabold
                    prose-em:text-ctp-subtext1
                    prose-blockquote:border-l-4 prose-blockquote:border-ctp-mauve prose-blockquote:bg-ctp-surface0/20 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:not-italic prose-blockquote:text-ctp-subtext0 prose-blockquote:rounded-r
                    prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-2
                    prose-li:pl-6 prose-li:relative prose-li:before:content-['▸'] prose-li:before:absolute prose-li:before:left-1 prose-li:before:text-ctp-teal
                    prose-code:text-ctp-peach prose-code:bg-ctp-surface0 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-sm
                    prose-pre:bg-ctp-mantle prose-pre:border-l-2 prose-pre:border-ctp-green prose-pre:p-4 prose-pre:rounded
                    prose-hr:border-0 prose-hr:h-[1px] prose-hr:bg-gradient-to-r prose-hr:from-transparent prose-hr:via-ctp-surface2 prose-hr:to-transparent prose-hr:my-8
                    [&_a]:after:content-['↗'] [&_a]:after:ml-1 [&_a]:after:text-xs [&_a]:after:opacity-70 [&_a]:no-underline hover:[&_a]:underline
                    selection:bg-ctp-surface2 selection:text-ctp-text
                  ">
                    {activeFile.content.data?.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 not-prose">
                        {activeFile.content.data.metrics.map((m: any) => (
                          <div key={m.label} className="group bg-gradient-to-br from-ctp-surface0 to-ctp-mantle p-4 rounded-lg border border-ctp-surface1 hover:border-ctp-blue/50 transition-all duration-300 hover:shadow-lg hover:shadow-ctp-blue/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                              <span className="text-4xl">📊</span>
                            </div>
                            <div className="text-3xl font-bold text-ctp-green mb-1 group-hover:scale-105 transition-transform origin-left">{m.value}</div>
                            <div className="text-xs text-ctp-subtext0 uppercase tracking-wider font-semibold">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
<div 
                                      className="markdown-body"
                                      dangerouslySetInnerHTML={{ __html: parseMarkdown(activeFile.content.body || '') }}
                                    />
                    
                    {activeFile.content.data?.domains && (
                       <div className="mt-12 pt-8 border-t border-ctp-surface1 not-prose">
                         <h3 className="text-sm font-bold text-ctp-peach uppercase tracking-widest mb-4 flex items-center gap-2">
                           <span>◆</span> Domains
                         </h3>
                         <div className="flex flex-wrap gap-3">
                           {activeFile.content.data.domains.map((d: string) => (
                             <span key={d} className="px-3 py-1 bg-ctp-surface0/50 text-ctp-subtext0 text-sm rounded-full border border-ctp-surface1 hover:border-ctp-peach/50 hover:text-ctp-peach transition-colors cursor-default">
                               {d}
                             </span>
                           ))}
                         </div>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-ctp-overlay1">
                <div className="text-6xl mb-4 opacity-20"></div>
                <p>Select a file to view content</p>
                <div className="mt-8 text-sm flex flex-col gap-1 items-center opacity-50">
                  <p><span className="bg-ctp-surface0 px-1 rounded">j</span> <span className="bg-ctp-surface0 px-1 rounded">k</span> to navigate</p>
                  <p><span className="bg-ctp-surface0 px-1 rounded">Enter</span> to open</p>
                  <p><span className="bg-ctp-surface0 px-1 rounded">Ctrl+h/l</span> to switch pane</p>
                  <p><span className="bg-ctp-surface0 px-1 rounded">t</span> toggle tech filter</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-stretch bg-ctp-surface0 text-xs h-6 border-t border-ctp-surface1">
          <div 
            className={`
              px-3 flex items-center font-bold text-ctp-base
              ${mode === 'NORMAL' ? 'bg-ctp-blue' : ''}
              ${mode === 'INSERT' ? 'bg-ctp-green' : ''}
              ${mode === 'VISUAL' ? 'bg-ctp-mauve' : ''}
            `}
          >
            {mode}
          </div>

            <div className="px-3 flex items-center bg-ctp-surface1 text-ctp-subtext1 gap-2">
              <span> main</span>
              {activeTechFilters.length > 0 && (
                <div className="px-2 flex items-center bg-ctp-peach text-ctp-base text-xs rounded-sm">
                  🔍 {activeTechFilters.length} filter{activeTechFilters.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          
          {mode === 'COMMAND' && !isSearching && (
             <div className="px-3 flex items-center flex-1 text-ctp-text bg-ctp-surface0">
               :{command}<span className="vim-cursor-block w-2 h-4 ml-1"></span>
             </div>
          )}

          {mode === 'COMMAND' && isSearching && (
             <div className="px-3 flex items-center flex-1 text-ctp-text bg-ctp-surface0">
               /{searchQuery}<span className="vim-cursor-block w-2 h-4 ml-1"></span>
             </div>
          )}

          {mode !== 'COMMAND' && (
            <div className="px-3 flex items-center flex-1 text-ctp-text truncate">
              {activeFile ? activeFile.path : '[No Name]'}
              {activeFile && <span className="ml-2 opacity-50 text-ctp-overlay2 hidden sm:inline">[Read Only]</span>}
            </div>
          )}

          <div className="flex items-center">
            <div className="px-3 flex items-center text-ctp-subtext0 bg-ctp-surface1 h-full hidden sm:flex">
              markdown
            </div>
            <div className="px-3 flex items-center text-ctp-subtext0 bg-ctp-surface2 h-full hidden sm:flex">
              utf-8
            </div>
            <div className="px-3 flex items-center text-ctp-base bg-ctp-blue h-full font-bold">
              {Math.floor(Math.random() * 100)}%  {cursorPos.line}:{cursorPos.col}
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-8 right-8 text-ctp-overlay0 text-xs font-mono pointer-events-none opacity-50">
        Typed by Brad Ash
      </div>
      
      {showHelp && (
        <div 
          className="fixed inset-0 bg-ctp-crust/80 flex items-center justify-center z-50"
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-ctp-base border border-ctp-surface1 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-ctp-surface1 pb-2">
              <h2 className="text-ctp-lavender text-lg font-bold">Keyboard Shortcuts</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-ctp-subtext0 hover:text-ctp-text"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="text-ctp-peach font-semibold mb-2">Navigation</h3>
                <div className="space-y-1 text-ctp-subtext0">
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">j</kbd> / <kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">↓</kbd> Move down</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">k</kbd> / <kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">↑</kbd> Move up</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">h</kbd> / <kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">←</kbd> Collapse / Left pane</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">l</kbd> / <kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">→</kbd> Expand / Right pane</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">gg</kbd> Go to top</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">G</kbd> Go to bottom</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">Enter</kbd> Open file</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-ctp-peach font-semibold mb-2">Search & Filter</h3>
                <div className="space-y-1 text-ctp-subtext0">
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">/</kbd> Search files</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">t</kbd> Toggle tech filter</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">n</kbd> Next search result</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">N</kbd> Previous search result</p>
                </div>
                
                <h3 className="text-ctp-peach font-semibold mb-2 mt-4">Commands</h3>
                <div className="space-y-1 text-ctp-subtext0">
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">:</kbd> Command mode</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">:q</kbd> Go home</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">Esc</kbd> Normal mode</p>
                  <p><kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">Esc Esc</kbd> Go home</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-ctp-surface1 text-center text-ctp-subtext0 text-xs">
              Press <kbd className="bg-ctp-surface0 px-1.5 py-0.5 rounded text-ctp-text">?</kbd> to toggle this help
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
