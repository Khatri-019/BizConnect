import { z } from "zod";

export const expertValidationSchema = z.object({
  img: z.string().url("Invalid image URL"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  industry: z.string().min(3, "Industry is required"),
  location: z.string().min(3, "Location is required"),
  experienceYears: z.number().min(1, "Must have at least 1 year of experience"),
  description: z.string().min(10, "Description is too short"),
  rating: z.number().min(0).max(5).optional(),
  pricing: z.number().min(1, "Pricing must be at least 1"),
});
