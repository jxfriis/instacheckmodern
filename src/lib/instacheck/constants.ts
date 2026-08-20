export const MILESTONES = [
  5000, 4000, 3000, 2000, 1500, 1000, 900, 800, 700, 600, 500, 400, 300, 200,
  100, 50, 10,
] as const;

export const STORAGE_KEY = "instacheck-v3";

export const INSTAGRAM_URL = "https://instagram.com/";

/** Valid Instagram username characters. */
const USERNAME_RE = /^[a-z0-9._]+$/;

export function isValidUsername(u: string) {
  return USERNAME_RE.test(u);
}
