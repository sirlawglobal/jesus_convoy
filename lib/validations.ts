import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const UserCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "leader", "worker"]),
  phone: z.string().optional(),
  ministry: z.string().optional(),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  role: z.enum(["admin", "leader", "worker"]).optional(),
  ministry: z.string().optional(),
});

export const SermonSchema = z.object({
  title: z.string().min(3),
  speaker: z.string().min(2),
  topic: z.string().min(2),
  date: z.string(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  audioUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const EventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  registrationOpen: z.boolean().optional(),
});

export const MinistrySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  leader: z.string().optional(),
  image: z.string().optional(),
});

export const BlogPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(20),
  category: z.string().min(2),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export const AnnouncementSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(10),
  audience: z.enum(["all", "workers", "ministry"]),
  ministry: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]),
  expiresAt: z.string().optional(),
});

export const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const DonationSchema = z.object({
  donorName: z.string().min(2),
  email: z.string().email(),
  amount: z.number().min(1),
  currency: z.enum(["NGN", "USD"]),
  category: z.enum(["tithe", "offering", "donation"]),
  reference: z.string(),
});

export const SettingsSchema = z.object({
  churchName: z.string().optional(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  heroImage: z.string().optional(),
  liveStreamUrl: z.string().optional(),
  serviceTimings: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  facebookUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  paystackEnabled: z.boolean().optional(),
});
