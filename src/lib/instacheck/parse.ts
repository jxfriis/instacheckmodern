import { isValidUsername } from "./constants";

const PROFILE_URL = /instagram\.com\\?\/(?:_u\\?\/)?([a-z0-9._]+)/i;

/** Accepts a bare name, an @name or a profile link. */
function normalizeUsername(line: string): string {
  const trimmed = line.trim();
  const url = trimmed.match(PROFILE_URL);
  return (url ? url[1] : trimmed).toLowerCase().replace(/^@/, "");
}

/** Parse a raw list of usernames (one per line) into a normalized string[]. */
export function parseList(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map(normalizeUsername)
    .filter((x) => isValidUsername(x));
}

/** Deduplicate while preserving insertion order. */
export function unique(users: string[]): string[] {
  return Array.from(new Set(users));
}

/** The usable names in a list, plus what was left out of it and why. */
export function inspectList(raw: string) {
  const lines = raw.split(/\r?\n/).filter((x) => x.trim());
  const valid = parseList(raw);
  const users = unique(valid);
  return {
    users,
    ignored: lines.length - valid.length,
    duplicates: valid.length - users.length,
  };
}

/**
 * Turn an uploaded file into a one-name-per-line list. Plain text passes straight through; the JSON and
 * HTML files from Instagram's own data download are reduced to the profiles they link to.
 */
export function listFromFile(text: string): string {
  if (!/^\s*[{[<]/.test(text)) return text;
  const links = text.matchAll(new RegExp(PROFILE_URL.source, "gi"));
  return unique(Array.from(links, (m) => m[1].toLowerCase())).join("\n");
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
