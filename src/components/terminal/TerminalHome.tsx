import { useState, useEffect } from 'react';
import ThemeSwitcher from '../react/ThemeSwitcher';

interface Process {
  pid: number;
  user: string;
  pri: number;
  state: string;
  time: string;
  command: string;
  slug?: string;
}

interface TerminalHomeProps {
  processes: Process[];
}

const ASCII_BANNER = `
 ██████╗ ██████╗ ███████╗███╗   ██╗    ██████╗ ██████╗  █████╗ ██████╗ 
██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗
██║   ██║██████╔╝█████╗  ██╔██╗ ██║    ██████╔╝██████╔╝███████║██║  ██║
██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║    ██╔══██╗██╔══██╗██╔══██║██║  ██║
╚██████╔╝██║     ███████╗██║ ╚████║    ██████╔╝██║  ██║██║  ██║██████╔╝
 ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
`.trim();

const getOSVersion = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `Human v${year}.${month}.${day}`;
};

const getUptime = () => {
  const start = new Date('2000-06-01T00:00:00');
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days} days, ${hours} hours, ${mins} mins`;
};

const FASTFETCH_DATA = [
  { label: 'Shell', value: 'zsh + mass-customized dotfiles' },
  { label: 'DE', value: 'macOS' },
  { label: 'Terminal', value: 'Tmux 3.6' },
  { label: 'CPU', value: 'Caffeinated (8 cores, 0 blockers)' },
  { label: 'GPU', value: 'Whiteboard-Accelerated™' },
  { label: 'Memory', value: 'RAM: 32GB / Chrome: 31.9GB' },
  { label: 'Disk', value: '128GB of PDFs "to read later"' },
  { label: 'Network', value: 'Low latency, high bandwidth' },
  { label: 'Location', value: 'Minneapolis, MN' },
  { label: 'Coords', value: '44.95, -93.31' },
  { label: 'Education', value: 'Rensselaer Polytechnic Institute' },
  { label: 'Locale', value: 'en_US.UTF-8' },
];

const SKILLS = [
  { name: 'Object-Oriented Programming', value: 98, color: 'text-ctp-blue' },
  { name: 'Product Design', value: 92, color: 'text-ctp-mauve' },
  { name: 'System Design', value: 88, color: 'text-ctp-green' },
  { name: 'DevOps/Automation', value: 85, color: 'text-ctp-peach' },
  { name: 'Team Leadership', value: 90, color: 'text-ctp-yellow' },
  { name: 'Communication', value: 95, color: 'text-ctp-teal' },
];

const CERTIFICATIONS = [
  { name: 'AWS Solutions Architect', color: 'text-ctp-peach' },
  { name: 'AWS Cloud Practitioner', color: 'text-ctp-peach' },
  { name: 'Azure Administrator', color: 'text-ctp-blue' },
  { name: 'Azure Fundamentals', color: 'text-ctp-blue' },
  { name: 'Terraform Associate', color: 'text-ctp-mauve' },
  { name: 'SnowPro Core', color: 'text-ctp-teal' },
];

const CAREER_TRAJECTORY = [
  { year: "'10", impact: 'h-[22%]', scale: 'h-[14%]' },
  { year: "'14", impact: 'h-[36%]', scale: 'h-[28%]' },
  { year: "'18", impact: 'h-[52%]', scale: 'h-[46%]' },
  { year: "'22", impact: 'h-[74%]', scale: 'h-[68%]' },
  { year: "'26", impact: 'h-[92%]', scale: 'h-full' },
];

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/unfrgivn', icon: '󰊤', color: 'text-ctp-text' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/bradash', icon: '󰌻', color: 'text-ctp-blue' },
  { name: 'Resume', url: '/brad_ash_resume.pdf', icon: '󰈙', color: 'text-ctp-peach' },
  // { name: 'About Me', url: '/projects#about', icon: '󰀄', color: 'text-ctp-lavender' }, // temporarily hidden
];

export default function TerminalHome({ processes }: TerminalHomeProps) {
  const [typedCommand, setTypedCommand] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        window.location.href = '/projects';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <div className="opacity-50 text-[10px]">/usr/bin/zsh</div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4 md:p-6 font-mono text-sm md:text-base">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full">
            
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-700 slide-in-from-left-4 bg-ctp-surface0/20 p-4 rounded-md border border-ctp-surface1">
                <pre className="hidden md:block text-ctp-blue font-bold text-[6px] sm:text-[8px] md:text-[10px] leading-none select-none overflow-x-auto">
{ASCII_BANNER}
                </pre>
                
                <div className="hidden md:block h-px bg-ctp-surface1 w-full"></div>
                
                <div className="space-y-1 flex-1">
                  <div className="flex gap-2 text-[10px] md:text-sm">
                    <span className="text-ctp-blue min-w-[80px] md:min-w-[100px]">OS</span>
                    <span className="text-ctp-text opacity-90">{getOSVersion()}</span>
                  </div>
                  <div className="flex gap-2 text-[10px] md:text-sm">
                    <span className="text-ctp-blue min-w-[80px] md:min-w-[100px]">Uptime</span>
                    <span className="text-ctp-text opacity-90">{getUptime()}</span>
                  </div>
                  {FASTFETCH_DATA.map((item) => (
                    <div key={item.label} className="flex gap-2 text-[10px] md:text-sm">
                      <span className="text-ctp-blue min-w-[80px] md:min-w-[100px]">{item.label}</span>
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

                  <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-ctp-surface1">
                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target={link.url.startsWith('http') ? '_blank' : undefined}
                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        download={link.name === 'Resume' ? true : undefined}
                        className={`${link.color} hover:underline text-xs md:text-sm flex items-center gap-1 transition-colors hover:text-ctp-lavender`}
                        title={link.name}
                      >
                        <span className="text-[10px] md:text-xs opacity-75">[</span>
                        {link.name}
                        <span className="text-[10px] md:text-xs opacity-75">]</span>
                      </a>
                    ))}
                  </div>

                  
                </div>
              </div>

              <div className="bg-ctp-surface0/20 p-4 rounded-md border border-ctp-surface1 animate-in fade-in duration-500 delay-500">
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
                  
                  <div className="pl-6 md:pl-8 text-ctp-overlay1 text-sm md:text-base italic">
                    # Press Enter to explore my work...
                  </div>

                  <div className="md:hidden mt-4">
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

            <div className="bg-ctp-surface0/30 p-4 rounded-md border border-ctp-surface1 animate-in fade-in duration-700 slide-in-from-right-4 delay-100 flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex justify-between items-center border-b border-ctp-surface1 pb-2">
                <span className="font-bold text-ctp-lavender">btop++ - {new Date().toLocaleTimeString()}</span>
                <span className="text-xs text-ctp-subtext0 hidden sm:inline">load average: 2.15, 1.85, 1.42</span>
              </div>
              
              <figure className="flex flex-col gap-2" aria-labelledby="impact-scale-heading">
                <figcaption className="flex items-center justify-between gap-3 text-xs font-bold uppercase text-ctp-overlay1">
                  <span id="impact-scale-heading">Impact &amp;&amp; Scale</span>
                  <span className="text-right text-[9px] font-normal normal-case text-ctp-overlay0 sm:text-[10px]">
                    directionally accurate™
                  </span>
                </figcaption>

                <div className="relative h-24 border-b border-l border-ctp-surface1 bg-ctp-surface0/20">
                  <div className="absolute right-2 top-1 z-10 flex gap-3 text-[9px] font-bold uppercase text-ctp-overlay1">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-ctp-green"></span>
                      Impact
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-ctp-blue"></span>
                      Scale
                    </span>
                  </div>

                  <span className="absolute left-1 top-1 text-[8px] uppercase text-ctp-overlay0">more ↑</span>

                  <div
                    className="absolute inset-x-3 bottom-5 top-6 grid grid-cols-5 gap-2 border-b border-ctp-surface1 px-1"
                    role="img"
                    aria-label="Impact and scale increase from 2010 through 2026. The trend is illustrative, not a quantitative scale."
                  >
                    {CAREER_TRAJECTORY.map((point) => (
                      <div key={point.year} className="flex h-full items-end justify-center gap-1">
                        <span
                          className={`w-2 min-h-1 bg-ctp-green sm:w-3 ${point.impact}`}
                          aria-hidden="true"
                        ></span>
                        <span
                          className={`w-2 min-h-1 bg-ctp-blue sm:w-3 ${point.scale}`}
                          aria-hidden="true"
                        ></span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-x-3 bottom-1 grid grid-cols-5 text-center text-[9px] text-ctp-overlay0 sm:text-[10px]">
                    {CAREER_TRAJECTORY.map((point) => (
                      <span key={point.year}>{point.year}</span>
                    ))}
                  </div>
                </div>
              </figure>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider">
                      <span className={skill.color}>{skill.name}</span>
                      <span className="text-ctp-subtext0">{skill.value}%</span>
                    </div>
                    <div className="h-1.5 bg-ctp-surface1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${skill.color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-ctp-surface1 pt-3 mt-2">
                {CERTIFICATIONS.map((cert) => (
                  <div key={cert.name} className={`text-[10px] px-2 py-1 rounded bg-ctp-surface0/40 ${cert.color} flex items-center gap-1.5 border border-ctp-surface0`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                    {cert.name}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 border-t border-ctp-surface1 pt-3">
                <div className="flex-1 flex justify-between items-center bg-ctp-surface0/40 px-3 py-2 rounded text-xs">
                  <span className="text-ctp-subtext0">TASKS</span>
                  <span className="font-bold text-ctp-green">142 total, 1 running</span>
                </div>
                <div className="flex-1 flex justify-between items-center bg-ctp-surface0/40 px-3 py-2 rounded text-xs">
                  <span className="text-ctp-subtext0">MEM</span>
                  <span className="font-bold text-ctp-mauve">16.4G / 32G</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 min-h-0">
                <div className="flex justify-between text-[10px] font-bold text-ctp-text bg-ctp-surface1 py-1 px-2 rounded-t">
                  <span className="w-10">PID</span>
                  <span className="w-12 hidden sm:inline-block">USER</span>
                  <span className="w-8 text-right hidden sm:inline-block">PRI</span>
                  <span className="w-8 text-center">ST</span>
                  <span className="w-12 text-right">TIME</span>
                  <span className="flex-1 pl-4">COMMAND</span>
                </div>
                <div className="flex flex-col text-[10px] sm:text-xs font-mono flex-1 overflow-y-auto scrollbar-hide">
                  {processes.map((proc, i) => (
                    <a 
                      key={proc.pid} 
                      href={proc.slug ? `/projects/${proc.slug}` : undefined}
                      className={`flex justify-between py-1 px-2 ${i % 2 === 0 ? 'bg-ctp-surface0/20' : 'bg-transparent'} hover:bg-ctp-surface1/30 transition-colors cursor-default block ${proc.slug ? 'cursor-pointer hover:bg-ctp-surface1/50' : ''}`}
                    >
                      <span className="w-10 text-ctp-green">{proc.pid}</span>
                      <span className="w-12 text-ctp-yellow hidden sm:inline-block">{proc.user}</span>
                      <span className={`w-8 text-right hidden sm:inline-block ${proc.pri < 0 ? 'text-ctp-red' : 'text-ctp-subtext0'}`}>{proc.pri}</span>
                      <span className="w-8 text-center text-ctp-subtext0">{proc.state}</span>
                      <span className="w-12 text-right text-ctp-peach">{proc.time}</span>
                      <span className="flex-1 pl-4 truncate text-ctp-text opacity-90" title={proc.command}>{proc.command}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
