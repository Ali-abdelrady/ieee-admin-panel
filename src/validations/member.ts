import { z } from "zod";

export const memberFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nationalId: z.string().optional(),
  status: z.string().optional(),

  password: z.string().min(6, "Password must be at least 6 characters"),

  email: z.string().email("Invalid email address"),
  personalEmail: z.string().email("Invalid personal email"),

  role: z.string().min(1, "Role is required"),
  phone: z.string().min(8, "Phone is too short"), // customize based on format

  university: z.string().min(1, "University is required"),
  faculty: z.string().min(1, "Faculty is required"),

  internalRoleId: z.string().optional(),
  committeeId: z.string().optional(),

  // You can validate committee separately or as `z.any()` if unsure
  committee: z.any().optional(), // or use z.lazy(() => committeeSchema) if defined
});
export type MemberFormData = z.infer<typeof memberFormSchema>;
