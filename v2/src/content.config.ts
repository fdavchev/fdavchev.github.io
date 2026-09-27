import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A claim on a case study and how it was checked: a command that was run, or a
// source it was read from. "verified" claims must say when they were checked.
const proof = z
  .object({
    claim: z.string(),
    command: z.string().optional(),
    source: z.string().optional(),
    status: z.enum(['verified', 'open']),
    checked: z.coerce.date().optional(),
    note: z.string().optional(),
  })
  .refine((entry) => (entry.command === undefined) !== (entry.source === undefined), {
    message: 'A proof needs exactly one of `command` or `source`.',
  })
  .refine((entry) => entry.status === 'open' || entry.checked !== undefined, {
    message: 'A verified proof needs a `checked` date.',
  });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number().int().positive(),
      thesis: z.string(),
      state: z.enum(['shipped', 'in-progress']),
      stateNote: z.string().optional(),
      stack: z.array(z.string()).min(1),
      // The one line of evidence shown on the work list.
      proofLine: z.string(),
      team: z.string().optional(),
      links: z.array(z.object({ label: z.string(), href: z.url() })).min(1),
      proofs: z.array(proof).min(1),
      figures: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            // lead: shown large under the header; sequence: the contact sheet
            // further down; callout: a small aside with its own note.
            role: z.enum(['lead', 'sequence', 'callout']),
          }),
        )
        .default([]),
      diagram: z.enum(['classroom-flow']).optional(),
    }),
});

export const collections = { projects };
