export function bytesToMB(bytes: number, decimals = 2): string {
  if (bytes === 0) return "5 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(decimals)} MB`;
}
