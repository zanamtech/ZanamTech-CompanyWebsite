import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Mirrors specs/001-enterprise-website-baseline/contracts/service-content.schema.json */
const scenario = z.object({
  problem: z.string().min(1),
  solution: z.string().min(1),
  outcome: z.string().min(1),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    order: z.number().int().min(1),
    name: z.string().min(3),
    group: z.enum(['cloud-infrastructure', 'engineering-ai']),
    icon: z.string(),
    summary: z.string().max(220),
    capabilities: z.array(z.string()).min(3).max(6),
    stack: z.array(z.string()).min(1),
    outcome: z.string(),
    scenarios: z.array(scenario).length(2),
    status: z.enum(['active', 'roadmap']).default('active'),
  }),
});

export const collections = { services };
