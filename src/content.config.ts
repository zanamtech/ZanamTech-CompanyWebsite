import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { engagementTypeIds, iconNames, offerIds, pillarIds } from './data/ids';

/**
 * Service front matter v2. Mirrors specs/002-enterprise-repositioning/contracts/service-content.schema.json.
 * Constitution III: illustrative scenarios carry no numbers, so any digit is rejected when kind is 'illustrative'.
 */
const DIGIT = /\d/;

const scenario = z
  .object({
    kind: z.enum(['real', 'illustrative']),
    problem: z.string().min(1),
    solution: z.string().min(1),
    outcome: z.string().min(1),
    evidenceId: z.string().optional(),
  })
  .refine((s) => s.kind === 'real' || ![s.problem, s.solution, s.outcome].some((t) => DIGIT.test(t)), {
    message: 'Illustrative scenarios must not contain numbers (Constitution III).',
  });

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    order: z.number().int().min(1),
    name: z.string().min(3),
    seoTitle: z.string().min(3).optional(),
    /** Meta description when `summary` is too long for search results (≤ 155 characters, checked by lint:content). */
    seoDescription: z.string().min(50).optional(),
    pillar: z.enum(pillarIds),
    flagship: z.boolean().default(false),
    /** Readiness gate: unpublished services are excluded from every menu, grid, page, form option and the sitemap. */
    published: z.boolean().default(true),
    icon: z.enum(iconNames),
    summary: z.string().max(220),
    deliverables: z.array(z.string()).min(3).max(8),
    engagementTypes: z.array(z.enum(engagementTypeIds)).min(1),
    capabilities: z.array(z.string()).min(3).max(7),
    stack: z.array(z.string()).min(1),
    outcome: z.string(),
    relatedOffer: z.enum(offerIds).optional(),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .max(6)
      .optional(),
    scenarios: z.array(scenario).min(1).max(2),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string().min(3),
    summary: z.string().max(240),
    /** Search-result title and description when `title` or `summary` is too long (lint:content checks the lengths). */
    seoTitle: z.string().min(3).optional(),
    seoDescription: z.string().min(50).optional(),
    /** Publish date. An article dated after the build date is left out of the build (src/lib/publish.ts). */
    date: z.coerce.date(),
    /** Last substantive update, for Article `dateModified`; defaults to `date`. */
    updated: z.coerce.date().optional(),
    /** Drafts render only in `astro dev`; every build excludes them (spec 002 FR-036). */
    draft: z.boolean().default(true),
    /** The service shown in the "Related service" card at the end of the article. */
    relatedService: reference('services').optional(),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string().min(3),
    summary: z.string().max(240),
    seoTitle: z.string().min(3).optional(),
    seoDescription: z.string().min(50).optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(true),
    /** Proof artefacts are always labelled "Sample". */
    sample: z.literal(true),
  }),
});

/** Named case studies render only from verified, permissioned entries (ADR-003). Ships empty. */
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string().min(3),
    industry: z.string(),
    challenge: z.string(),
    approach: z.string(),
    result: z.string(),
    stack: z.array(z.string()).min(1),
    timeline: z.string(),
    verified: z.boolean(),
    permissionDate: z.coerce.date(),
    evidence: z.string().min(1),
  }),
});

export const collections = { services, insights, resources, caseStudies };
