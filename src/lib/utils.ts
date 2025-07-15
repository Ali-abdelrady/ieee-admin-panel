import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prepareRequestPayload(formData: any) {
  const hasFile = Object.values(formData).some(
    (val) => val instanceof File || val instanceof FileList
  );
  console.log("hasFile:", hasFile);
  console.log(formData);
  if (!hasFile) return formData;
  // console.log("has File");
  const fd = new FormData();
  for (const key in formData) {
    const val = formData[key];

    if (val instanceof FileList) {
      fd.append(key, val[0]);
    } else if (val instanceof Date) {
      // ✅ Format date before appending
      fd.append(key, format(val, "yyyy-MM-dd"));
    } else {
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
