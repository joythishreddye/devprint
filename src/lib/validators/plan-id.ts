import { z } from 'zod';

export const planIdSchema = z.string().uuid('Invalid plan ID');
