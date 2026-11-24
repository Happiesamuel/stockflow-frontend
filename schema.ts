import { z } from "zod";

const email = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

export const signUpSchema = z.object({
  firstName: z.string("Enter your firstname").min(2, "Enter your firstname"),
  lastName: z.string("Enter your lastname").min(2, "Enter your lastname"),
  email,
  password: z.string().min(8, "Use at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    otp: z.string().regex(/^\d{6}$/, "Enter the complete 6-digit code"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2, "Enter your business name"),
  industry: z.string(),
  email: z.string().email("Enter a valid email address").or(z.literal("")),
  phone: z.string(),
  address: z.string(),
  currency: z.string().min(1, "Choose a currency"),
});
export type CreateBusinessValues = z.infer<typeof createBusinessSchema>;

export const joinBusinessSchema = z.object({
  code: z.string().trim().min(1, "Enter your invitation code"),
});
export type JoinBusinessValues = z.infer<typeof joinBusinessSchema>;
