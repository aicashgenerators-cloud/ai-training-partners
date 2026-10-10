import { z } from "zod";

export const INTEREST_OPTIONS = [
  { value: "ai_training", label: "AI Training" },
  { value: "outlier", label: "Outlier" },
  { value: "handshake", label: "Handshake" },
  { value: "not_sure", label: "I'm not sure yet" },
] as const;

export const CONTACT_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
] as const;

export const REGISTRATION_STATUSES = [
  "new",
  "contacted",
  "handler_assigned",
  "onboarding",
  "completed",
  "closed",
] as const;

export const registrationInputSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone or WhatsApp number")
    .max(32),
  country: z.string().trim().min(2, "Please select your country").max(120),
  interest: z.enum(["ai_training", "outlier", "handshake", "not_sure"]),
  preferredContact: z.enum(["whatsapp", "email"]),
  message: z.string().trim().max(2000).optional(),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;
