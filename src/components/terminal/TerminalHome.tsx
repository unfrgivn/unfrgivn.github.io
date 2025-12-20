import React, { useState, useEffect } from 'react';

const ASCII_LOGO = `
      .
     / \\
    /   \\
   /  |  \\
  /   |   \\
 /    |    \\
/_____|_____\\
      |
      |
      |
`;

const FASTFETCH_DATA = [
  { label: 'User', value: 'Brad Ash' },
  { label: 'Host', value: 'MacBook Pro M3 Max' },
  { label: 'OS', value: 'macOS Sequoia 15.2' },
  { label: 'Uptime', value: '15 years 3 months' },
  { label: 'Shell', value: 'zsh 5.9' },
  { label: 'Resolution', value: '3456x2234' },
  { label: 'DE', value: 'Aqua' },
  { label: 'WM', value: 'Quartz Compositor' },
  { label: 'Terminal', value: 'Alacritty' },
  { label: 'CPU', value: 'M3 Max (16) @ 4.05GHz' },
  { label: 'GPU', value: 'Apple M3 Max' },
  { label: 'Memory', value: '4176MiB / 36864MiB' },
];

const SKILLS = [
  { name: 'TypeScript/React', value: 98, color: 'text-ctp-blue' },
  { name: 'Rust/Go', value: 92, color: 'text-ctp-mauve' },
  { name: 'System Design', value: 88, color: 'text-ctp-green' },
  { name: 'DevOps/K8s', value: 85, color: 'text-ctp-peach' },
  { name: 'Team Leadership', value: 90, color: 'text-ctp-yellow' },
  { name: 'Communication', value: 95, color: 'text-ctp-teal' },
];

export default function TerminalHome() {
  const [typedCommand, setTypedCommand] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const text = "nvim projects/";
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedCommand(text.slice(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-ctp-base text-ctp-text font-mono overflow-hidden select-none p-4 md:p-8">
      <div className="flex flex-col flex-1 border border-ctp-surface1 rounded-lg shadow-2xl overflow-hidden relative crt-curve bg-ctp-mantle/90 backdrop-blur-sm">
        <div className="scanlines pointer-events-none absolute inset-0 z-50 opacity-[0.03]"></div>
        
        <div className="flex justify-between items-center bg-ctp-crust border-b border-ctp-surface1 px-3 py-2 text-xs text-ctp-subtext1 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-ctp-red hover:bg-red-500 transition-colors"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-ctp-yellow hover:bg-yellow-500 transition-colors"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-ctp-green hover:bg-green-500 transition-colors"></div>
            </div>
            <span className="ml-3 font-bold opacity-75 font-mono">zsh — 80x24</span>
          </div>
          <div className="opacity-50 text-[10px]">/usr/bin/zsh</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-sm md:text-base scrollbar-hide">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
            
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start animate-in fade-in duration-700 slide-in-from-left-4">
              <div className="hidden sm:block text-ctp-blue font-bold whitespace-pre leading-none select-none opacity-80 pt-2">
                {ASCII_LOGO}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-ctp-blue font-bold">brad</span>
                  <span className="text-ctp-text">@</span>
                  <span className="text-ctp-mauve font-bold">portfolio</span>
                </div>
                <div className="h-px bg-ctp-surface1 mb-3 w-full"></div>
                
                {FASTFETCH_DATA.map((item) => (
                  <div key={item.label} className="flex gap-2">
                    <span className="text-ctp-blue min-w-[100px]">{item.label}</span>
                    <span className="text-ctp-text opacity-90">{item.value}</span>
                  </div>
                ))}

                <div className="flex gap-2 mt-4 pt-2">
                  <div className="w-8 h-4 bg-ctp-red rounded-sm"></div>
                  <div className="w-8 h-4 bg-ctp-green rounded-sm"></div>
                  <div className="w-8 h-4 bg-ctp-yellow rounded-sm"></div>
                  <div className="w-8 h-4 bg-ctp-blue rounded-sm"></div>
                  <div className="w-8 h-4 bg-ctp-mauve rounded-sm"></div>
                  <div className="w-8 h-4 bg-ctp-teal rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="bg-ctp-surface0/30 p-4 rounded-md border border-ctp-surface1 animate-in fade-in duration-700 slide-in-from-right-4 delay-100">
              <div className="flex justify-between items-center mb-4 border-b border-ctp-surface1 pb-2">
                <span className="font-bold text-ctp-lavender">top - {new Date().toLocaleTimeString()}</span>
                <span className="text-xs text-ctp-subtext0">load average: 1.88, 1.42, 1.15</span>
              </div>
              
              <div className="space-y-3">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs uppercase tracking-wider">
                      <span className={skill.color}>{skill.name}</span>
                      <span className="text-ctp-subtext0">{skill.value}%</span>
                    </div>
                    <div className="h-2 bg-ctp-surface1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${skill.color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-ctp-surface1">
                <div className="flex flex-col items-center p-2 bg-ctp-surface0/50 rounded">
                  <span className="text-xs text-ctp-subtext0 uppercase mb-1">Tasks</span>
                  <span className="text-xl font-bold text-ctp-green">142 total</span>
                  <span className="text-xs text-ctp-blue">1 running</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-ctp-surface0/50 rounded">
                  <span className="text-xs text-ctp-subtext0 uppercase mb-1">Memory</span>
                  <span className="text-xl font-bold text-ctp-mauve">16.4G</span>
                  <span className="text-xs text-ctp-overlay1">used</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 md:pt-12 pb-4 animate-in fade-in duration-500 delay-500">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-lg md:text-xl">
                <span className="text-ctp-green font-bold">➜</span>
                <span className="text-ctp-blue font-bold">~</span>
                <a 
                  href="/projects" 
                  className="group flex items-center gap-2 text-ctp-text hover:text-ctp-blue transition-colors outline-none"
                >
                  <span>{typedCommand}</span>
                  <span className={`block w-2.5 h-5 bg-ctp-text ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                </a>
              </div>
              
              <div className="pl-6 md:pl-8 text-ctp-overlay1 text-sm md:text-base italic mt-2">
                # Click to explore my work...
              </div>

              <div className="md:hidden mt-6">
                <a 
                  href="/projects"
                  className="block w-full py-3 bg-ctp-blue text-ctp-base font-bold text-center rounded shadow-lg hover:bg-ctp-sapphire transition-colors"
                >
                  ENTER SYSTEM
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
