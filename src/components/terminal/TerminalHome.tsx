import React, { useState, useEffect } from 'react';
import ThemeSwitcher from '../react/ThemeSwitcher';

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
  { name: 'TypeScript/React', value: 98, color: 'text-ctp-blue' },
  { name: 'Rust/Go', value: 92, color: 'text-ctp-mauve' },
  { name: 'System Design', value: 88, color: 'text-ctp-green' },
  { name: 'DevOps/K8s', value: 85, color: 'text-ctp-peach' },
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

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/unfrgivn', icon: '󰊤', color: 'text-ctp-text' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/bradash', icon: '󰌻', color: 'text-ctp-blue' },
  { name: 'Email', url: 'mailto:brad@yoursite.com', icon: '󰇮', color: 'text-ctp-green' },
  { name: 'Resume', url: '/brad_ash_resume.pdf', icon: '󰈙', color: 'text-ctp-peach' },
];

const PROCESSES = [
  { pid: 8921, user: 'brad', pri: -20, state: 'S', time: '4y1m', command: 'Architected event-driven system handling $2B+ transactions', slug: 'subscription-api' },
  { pid: 1192, user: 'brad', pri: -15, state: 'S', time: '2y8m', command: 'Led migration to microservices architecture', slug: 'metamorphosisjs' },
  { pid: 4521, user: 'brad', pri: -10, state: 'S', time: '1y2m', command: 'Built real-time data pipeline processing 1M+ events/sec', slug: 'ksqldb-modeling' },
  { pid: 8823, user: 'brad', pri: -5,  state: 'S', time: '8m',   command: 'Reduced deployment time from 2 hours to 5 minutes', slug: 'automated-qa-deployments' },
  { pid: 3391, user: 'brad', pri: 0,   state: 'R', time: '5y+',  command: 'Mentored 12 engineers to senior level' },
  { pid: 5612, user: 'brad', pri: 0,   state: 'S', time: '1y6m', command: 'Designed identity platform serving 50M users', slug: 'identity-guardrail' },
  { pid: 7234, user: 'brad', pri: 0,   state: 'S', time: '9m',   command: 'Created internal developer SDK used by 200+ engineers', slug: 'internal-developer-sdk' },
  { pid: 9102, user: 'brad', pri: 0,   state: 'S', time: '2y',   command: 'Established SRE practices reducing incidents by 70%', slug: 'cloud-paas' },
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
          <div className="opacity-50 text-[10px]">/usr/bin/zsh</div>
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

                  <div className="mt-2 pt-2 border-t border-ctp-surface1">
                    <ThemeSwitcher />
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
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold uppercase text-ctp-overlay1">
                  <span>Career Velocity</span>
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ctp-green rounded-full"></span>Impact</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ctp-blue rounded-full"></span>Prod</span>
                  </div>
                </div>
                
                <div className="h-24 flex items-end justify-between gap-1 sm:gap-2 px-1 border-b border-ctp-surface1 border-l border-ctp-surface1 bg-ctp-surface0/20 pt-4 pb-0 relative">
                  <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none p-1">
                    <div className="w-full h-px bg-ctp-text"></div>
                    <div className="w-full h-px bg-ctp-text"></div>
                    <div className="w-full h-px bg-ctp-text"></div>
                  </div>

                  {[
                    { y: "'10", i: 20, p: 30 },
                    { y: "'12", i: 30, p: 40 },
                    { y: "'14", i: 45, p: 50 },
                    { y: "'16", i: 50, p: 55 },
                    { y: "'18", i: 65, p: 60 },
                    { y: "'20", i: 75, p: 70 },
                    { y: "'22", i: 85, p: 85 },
                    { y: "'24", i: 95, p: 98 },
                  ].map((d) => (
                    <div key={d.y} className="flex flex-col items-center gap-0.5 flex-1 group">
                      <div className="w-full max-w-[12px] sm:max-w-[16px] flex items-end justify-center gap-[1px] h-full">
                        <div style={{ height: `${d.i}%` }} className="w-1.5 sm:w-2 bg-ctp-green opacity-80 group-hover:opacity-100 transition-all rounded-t-sm"></div>
                        <div style={{ height: `${d.p}%` }} className="w-1.5 sm:w-2 bg-ctp-blue opacity-80 group-hover:opacity-100 transition-all rounded-t-sm"></div>
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-ctp-overlay0 mt-1">{d.y}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                  {PROCESSES.map((proc, i) => (
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
