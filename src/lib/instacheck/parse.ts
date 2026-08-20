import { isValidUsername } from "./constants";

/** Parse a raw list of usernames (one per line) into a normalized string[]. */
export function parseList(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((x) => x.trim().toLowerCase().replace(/^@/, ""))
    .filter((x) => isValidUsername(x));
}

/** Deduplicate while preserving insertion order. */
export function unique(users: string[]): string[] {
  return Array.from(new Set(users));
}

/**
 * Users you follow who do not follow you back, sorted alphabetically.
 * Preserves the original order of the "following" list for dedup stability.
 */
export function computeUnfollowers(
  following: string[],
  followers: string[]
): string[] {
  const followerSet = new Set(followers);
  return unique(following)
    .filter((u) => !followerSet.has(u))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}
