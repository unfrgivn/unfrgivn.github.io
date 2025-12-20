import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { Filter, X } from 'lucide-react';
import clsx from 'clsx';

interface Project {
  slug: string;
  data: {
    title: string;
    summary?: string;
    tech: string[];
    domains?: string[];
    role?: string;
    featured?: boolean;
    company?: string;
  };
}

interface ProjectFilterProps {
  projects: Project[];
  allTags: string[];
  allDomains: string[];
}

export default function ProjectFilter({ projects, allTags, allDomains }: ProjectFilterProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedDomain(null);
    setSelectedTags([]);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesDomain = selectedDomain ? project.data.domains?.includes(selectedDomain) : true;
      const matchesTags = selectedTags.length > 0 
        ? selectedTags.every(tag => project.data.tech.includes(tag))
        : true;
      return matchesDomain && matchesTags;
    });
  }, [projects, selectedDomain, selectedTags]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between md:hidden">
        <span className="text-sm font-medium text-muted">
          {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
        </span>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className={clsx(
        "mb-12 flex flex-col gap-8 border-b border-border/40 pb-12 md:flex",
        isFilterOpen ? "flex" : "hidden"
      )}>
        <div>
          <h3 className="mb-3 text-xs font-mono uppercase tracking-wider text-faint">Domain</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDomain(null)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                !selectedDomain 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "bg-surface-2 text-muted hover:bg-surface-1 hover:text-text"
              )}
            >
              All
            </button>
            {allDomains.map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain === selectedDomain ? null : domain)}
                className={clsx(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  selectedDomain === domain
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-surface-2 text-muted hover:bg-surface-1 hover:text-text"
                )}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-faint">Technology</h3>
            {(selectedTags.length > 0 || selectedDomain) && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-danger hover:underline"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={clsx(
                  "rounded px-2 py-1 text-xs font-mono transition-colors border",
                  selectedTags.includes(tag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent bg-surface-2 text-muted hover:bg-surface-1 hover:text-text"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg text-muted">No projects found matching your filters.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}