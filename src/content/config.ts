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

export const collections = {
  projects: projectsCollection,
};
