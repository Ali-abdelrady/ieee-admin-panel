import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prepareRequestPayload(formData: any) {
  const hasFileOrHttpUrl = Object.values(formData).some((val) => {
    if (val instanceof File || val instanceof FileList) return true;
    if (typeof val === "string" && val.startsWith("http")) return true;
    if (Array.isArray(val) && val.some((item) => item instanceof File))
      return true;
    return false;
  });

  if (!hasFileOrHttpUrl) return formData;

  const fd = new FormData();

  for (const key in formData) {
    const val = formData[key];

    if (val == null) continue;

    // Handle arrays (including file arrays)
    if (Array.isArray(val)) {
      if (val.some((item) => item instanceof File)) {
        // Convert file array to array of binary data
        const fileArray = val
          .map((file) => {
            if (file instanceof File) {
              return file; // Keep as File object for FormData
            }
            return null;
          })
          .filter(Boolean);

        // Append each file with the same key
        fileArray.forEach((file) => {
          fd.append(key, file);
        });
      } else {
        // Non-file array - stringify
        fd.append(key, JSON.stringify(val));
      }
    }
    // Handle single file
    else if (val instanceof File) {
      fd.append(key, val);
    }
    // Handle FileList
    else if (val instanceof FileList) {
      Array.from(val).forEach((file) => {
        fd.append(key, file);
      });
    }
    // Handle Date objects
    else if (val instanceof Date) {
      fd.append(key, format(val, "yyyy-MM-dd"));
    }
    // Handle other objects
    else if (typeof val === "object") {
      fd.append(key, JSON.stringify(val));
    }
    // Handle primitives
    else {
      fd.append(key, val);
    }
  }

  return fd;
}
export function getImageUrl(path: string): string {
  if (!path) return "";

  // If already absolute (starts with http), return as-is
  if (path.startsWith("http")) {
    return path;
  }

  // Prefix with base URL
  return `${process.env.NEXT_PUBLIC_BASE_URL || ""}${path}`;
}
export function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
export function generatePassword(length: number = 16): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

  const allChars = upper + lower + numbers + symbols;

  let password = "";

  // Ensure at least one of each type
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle password (to avoid predictable positions)
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
