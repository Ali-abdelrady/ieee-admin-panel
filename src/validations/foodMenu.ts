import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Item description is required"),
  price: z
    .number()
    .min(0, "Price must be positive")
    .nonnegative("Price cannot be negative"),
  available: z.boolean(),
});

export const foodMenuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  // menuImageUrl: z.array(z.string()),

  // items: z.array(menuItemSchema).min(1, "At least one menu item is required"),
});

// Optional: You can create TypeScript types from these schemas
export type MenuItemType = z.infer<typeof menuItemSchema>;
export type FoodMenuRequestType = z.infer<typeof foodMenuSchema>;
