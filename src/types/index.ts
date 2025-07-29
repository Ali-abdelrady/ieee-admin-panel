import { loginFormSchema } from "@/validations/forms";
import { z } from "zod";

export type FormFieldType = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  readonly?: boolean;
  dynamicArrayFieldsConfig?: {
    fields?: FormFieldType[];
    isSimpleArray?: boolean;
    addButtonLabel?: string;
    itemName?: string;
  };
  type:
    | "text"
    | "time"
    | "checkbox"
    | "select"
    | "file"
    | "email"
    | "date"
    | "keyValue"
    | "multiSelect"
    | "sheet"
    | "sheet2"
    | "stepper"
    | "number"
    | "radio"
    | "selectInputType"
    | "textArea"
    | "password"
    | "socialLinks"
    | "topics"
    | "switch"
    | "dynamicArrayField";
  options?: { label: string; value: number | string }[]; // for select
  dynamicOptions?: boolean;
  extraProps?: object;
  fileUploadConfig?: {
    maxFiles: number;
    maxSize?: number;
    fileType: "video" | "image" | "all";
  };
};
export type FormSection = {
  label: string;
  fields: FormFieldType[];
};
export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  permissions?: string[];
  committe?: string;
};
// login
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  status: string;
  data: {
    user: UserType;
  };
}
export interface FileType {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: unknown[];
  custom_properties: unknown[];
  generated_conversions: unknown[];
  responsive_images: unknown[];
  order_column: number;
  original_url: string;
  preview_url: string;
  created_at?: string;
  updated_at?: string;
}

export const fileSchema = z.object({
  id: z.number(),
  model_type: z.string().min(1, "Model type is required"),
  model_id: z.number(),
  uuid: z.string().uuid("Invalid UUID"),
  collection_name: z.string().min(1, "Collection name is required"),
  name: z.string().min(1, "Name is required"),
  file_name: z.string().min(1, "File name is required"),
  mime_type: z.string().min(1, "MIME type is required"),
  disk: z.string().min(1, "Disk is required"),
  conversions_disk: z.string().min(1, "Conversions disk is required"),
  size: z.number().min(1, "Size must be greater than 0"),
  manipulations: z.array(z.unknown()),
  custom_properties: z.array(z.unknown()),
  generated_conversions: z.array(z.unknown()),
  responsive_images: z.array(z.unknown()),
  order_column: z.number(),
  created_at: z.string(), // consider using z.coerce.date() if parsed as Date
  updated_at: z.string(),
  original_url: z.string().url("Invalid original URL"),
  preview_url: z.string().url("Invalid preview URL"),
});
