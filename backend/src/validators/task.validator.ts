import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string({ 
      error: (issue) => issue.input === undefined ? 'TITLE_REQUESTED' : 'INVALID_INPUT' 
    })
    .trim()
    .min(1, 'TITLE_REQUESTED')
    .max(100, 'TITLE_TOO_LONG'),
  description: z
    .string()
    .max(500, 'INVALID_INPUT')
    .optional()
    .default(''),
});