import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

interface ProjectCardProps {
  project: {
    slug: string;
    data: {
      title: string;
      summary?: string;
      tech: string[];
      domains?: string[];
      role?: string;
      featured?: boolean;
    };
  };
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const { slug } = project;
  const { title, summary, tech, domains, role } = project.data;

  return (
    <a
      href={`/projects/${slug}`}
      className={clsx(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-surface-1 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5",
        featured ? "border-primary/20 bg-gradient-to-br from-surface-1 to-surface-2 md:p-8" : "border-border"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        {domains && domains.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {domains.slice(0, 2).map((domain) => (
              <span key={domain} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary-2">
                {domain}
              </span>
            ))}
          </div>
        )}

        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className={clsx(
              "font-bold text-text transition-colors group-hover:text-primary",
              featured ? "text-3xl" : "text-xl"
            )}>
              {title}
            </h3>
            <p className="text-sm text-muted">{role}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted/80">
          {summary}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {tech.slice(0, featured ? 6 : 4).map((t) => (
          <span key={t} className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-faint uppercase tracking-wider transition-colors group-hover:bg-surface-1 group-hover:text-muted">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}