import { z } from 'zod';

export const tweetSchema = z.object({
  content: z
    .string()
    .min(1, 'Tweet cannot be empty')
    .max(280, 'Tweet cannot exceed 280 characters'),
  image_url: z.string().url().optional().nullable(),
});

export type TweetFormData = z.infer<typeof tweetSchema>;

export const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters'),
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name cannot exceed 100 characters'),
  bio: z.string().max(160, 'Bio cannot exceed 160 characters').optional(),
  avatar_url: z.string().url().optional(),
});

export type UserFormData = z.infer<typeof userSchema>; 