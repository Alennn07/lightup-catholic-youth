import { z } from 'zod'

// =============================================
// AUTHENTICATION SCHEMAS
// =============================================

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().min(13, 'Must be at least 13 years old').max(120, 'Invalid age'),
  parish: z.string().min(1, 'Parish is required').max(255, 'Parish name too long'),
  diocese: z.string().min(1, 'Diocese is required').max(255, 'Diocese name too long')
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// =============================================
// PRAYER REQUEST SCHEMAS
// =============================================

export const PrayerRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  category: z.enum(['Health', 'Family', 'Education', 'Work', 'Spiritual', 'Other']),
  is_anonymous: z.boolean().default(false)
})

export const PrayerResponseSchema = z.object({
  content: z.string().min(1, 'Response is required').max(1000, 'Response too long'),
  is_anonymous: z.boolean().default(false)
})

// =============================================
// JOURNAL SCHEMAS
// =============================================

export const JournalEntrySchema = z.object({
  title: z.string().max(255, 'Title too long').optional(),
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  mood: z.enum(['joyful', 'peaceful', 'grateful', 'hopeful', 'contemplative', 'struggling', 'anxious', 'sad']).optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
  is_private: z.boolean().default(true),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional()
})

// =============================================
// YOUTH GROUP SCHEMAS
// =============================================

export const YouthGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(255, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  mission_statement: z.string().max(500, 'Mission statement too long').optional(),
  parish: z.string().max(255, 'Parish name too long').optional(),
  diocese: z.string().max(255, 'Diocese name too long').optional(),
  city: z.string().max(255, 'City name too long').optional(),
  state: z.string().max(100, 'State name too long').optional(),
  country: z.string().max(100, 'Country name too long').optional(),
  meeting_location: z.string().max(500, 'Location too long').optional(),
  meeting_time: z.string().max(255, 'Meeting time too long').optional(),
  meeting_frequency: z.string().max(100, 'Frequency too long').optional(),
  age_range: z.string().max(100, 'Age range too long').optional(),
  max_members: z.number().min(1, 'Must allow at least 1 member').max(1000, 'Too many members').default(50),
  is_public: z.boolean().default(true)
})

export const GroupEventSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(255, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long'),
  max_attendees: z.number().min(1, 'Must allow at least 1 attendee').max(1000, 'Too many attendees').default(50),
  is_public: z.boolean().default(true)
})

export const GroupPostSchema = z.object({
  title: z.string().max(255, 'Title too long').optional(),
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  post_type: z.enum(['general', 'announcement', 'discussion', 'prayer']).default('general'),
  is_public: z.boolean().default(true)
})

// =============================================
// QUIZ SCHEMAS
// =============================================

export const QuizAttemptSchema = z.object({
  category: z.enum(['faith-basics', 'bible-trivia', 'church-history', 'modern-faith', 'saints-heroes', 'prayer-worship']),
  answers: z.array(z.number()).min(1, 'Must provide answers'),
  time_spent: z.number().min(0, 'Time spent cannot be negative').default(0)
})

// =============================================
// PRAYER SESSION SCHEMAS
// =============================================

export const PrayerSessionSchema = z.object({
  session_type: z.enum(['guided', 'freeform', 'meditation']).default('guided'),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute').max(300, 'Duration too long'),
  prayer_focus: z.string().max(500, 'Prayer focus too long').optional(),
  mood_before: z.number().min(1).max(5).optional(),
  mood_after: z.number().min(1).max(5).optional(),
  notes: z.string().max(1000, 'Notes too long').optional()
})

// =============================================
// EVENT SCHEMAS
// =============================================

export const EventSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(255, 'Title too long'),
  type: z.string().min(1, 'Event type is required').max(100, 'Type too long'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long'),
  max_attendees: z.number().min(1, 'Must allow at least 1 attendee').max(1000, 'Too many attendees').default(100),
  description: z.string().max(1000, 'Description too long').optional(),
  requirements: z.string().max(500, 'Requirements too long').optional(),
  contact_email: z.string().email('Invalid email address').optional(),
  contact_phone: z.string().max(50, 'Phone number too long').optional()
})

export const EventRegistrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50, 'Phone number too long').optional(),
  age: z.number().min(13, 'Must be at least 13 years old').max(120, 'Invalid age'),
  parish: z.string().min(1, 'Parish is required').max(255, 'Parish name too long'),
  diocese: z.string().min(1, 'Diocese is required').max(255, 'Diocese name too long'),
  emergency_contact: z.string().min(1, 'Emergency contact is required').max(255, 'Emergency contact too long'),
  dietary_restrictions: z.string().max(500, 'Dietary restrictions too long').optional(),
  special_needs: z.string().max(500, 'Special needs too long').optional(),
  agree_to_terms: z.boolean().refine(val => val === true, 'Must agree to terms'),
  agree_to_photo_release: z.boolean().refine(val => val === true, 'Must agree to photo release')
})

// =============================================
// BIBLE VERSE SCHEMAS
// =============================================

export const VerseProgressSchema = z.object({
  verse_id: z.string().min(1, 'Verse ID is required'),
  verse_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  is_completed: z.boolean().default(false)
})

export const FavoriteVerseSchema = z.object({
  verse_id: z.string().min(1, 'Verse ID is required')
})

// =============================================
// USER SCHEMAS
// =============================================

export const UserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
  age: z.number().min(13, 'Must be at least 13 years old').max(120, 'Invalid age'),
  parish: z.string().max(255, 'Parish name too long').optional(),
  diocese: z.string().max(255, 'Diocese name too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  avatar_url: z.string().url('Invalid URL').optional()
})

// =============================================
// QUERY PARAMETER SCHEMAS
// =============================================

export const PaginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
  search: z.string().max(100, 'Search term too long').optional()
})

export const UserIdSchema = z.object({
  userId: z.string().uuid('Invalid user ID')
})
