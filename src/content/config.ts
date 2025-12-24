import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string().optional(),
    company: z.string().optional(),
    role: z.string().optional(),
    year: z.string().optional(),
    featured: z.boolean().default(false),
    priority: z.number().default(0),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    domains: z.array(z.string()).default([]),
    tech: z.array(z.string()).default([]),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    links: z.object({
      github: z.string().optional(),
      live: z.string().optional(),
      demo: z.string().optional(),
    }).optional(),
    media: z.object({
      cover: z.string().optional(),
    }).optional(),
  }),
});

const highlightsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    command: z.string(),
    pid: z.number(),
    priority: z.number().default(0),
    state: z.enum(['R', 'S', 'D', 'Z']).default('S'),
    time: z.string(),
    projectSlug: z.string().optional(),
    company: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  projects: projectsCollection,
  highlights: highlightsCollection,
};
