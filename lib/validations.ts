import { z } from 'zod';
import { IssueCategory } from '@prisma/client';

// ─── Auth Schemas ──────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// ─── Issue Schemas ─────────────────────────────────────────────────────────────

export const CreateIssueSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be under 100 characters'),
  description: z
    .string()
    .min(20, 'Please provide at least 20 characters of description')
    .max(1000, 'Description must be under 1000 characters'),
  // Derived from the Prisma enum so adding a category cannot leave this behind.
  // Hardcoding the literals here previously rejected 8 of the 12 categories the
  // form offers, failing submission only after the photo had been uploaded.
  category: z.nativeEnum(IssueCategory, { required_error: 'Please select a category' }),
  locationLat: z.number({ required_error: 'Please pin a location on the map' }),
  locationLng: z.number({ required_error: 'Please pin a location on the map' }),
  address: z.string().min(1, 'Address is required'),
  photoUrl: z.string().url('Please upload a photo of the issue'),
});

// ─── Profile Schema ────────────────────────────────────────────────────────────

/** Reserved so a handle can never collide with an app route. */
const RESERVED_USERNAMES = [
  'admin',
  'authority',
  'api',
  'login',
  'register',
  'profile',
  'dashboard',
  'report',
  'issue',
  'leaderboard',
  'settings',
  'mycity',
];

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be under 60 characters'),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be under 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Use only lowercase letters, numbers and underscores')
    .refine((v) => !RESERVED_USERNAMES.includes(v), 'That username is reserved')
    .optional()
    .or(z.literal('')),
  bio: z.string().trim().max(280, 'Bio must be under 280 characters').optional().or(z.literal('')),
  location: z
    .string()
    .trim()
    .max(80, 'Location must be under 80 characters')
    .optional()
    .or(z.literal('')),
  image: z.string().url('Photo must be a valid URL').optional().or(z.literal('')),
});


