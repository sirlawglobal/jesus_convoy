/** Convert a string to a URL-safe slug */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format a date to a readable string */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format currency in NGN */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Truncate text to a given length */
export function truncate(text: string, length = 160): string {
  if (text.length <= length) return text;
  return text.slice(0, length).replace(/\s+\S*$/, "") + "…";
}

/** Generate a random reference string */
export function generateReference(): string {
  return `JC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
