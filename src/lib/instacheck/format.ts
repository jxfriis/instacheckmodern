import { isValidUsername } from "./constants";
import type { InstaCheckState } from "./types";
import { getUserFolder } from "./selectors";

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function exportFileName(suffix = ""): string {
  return `InstaCheck ${todayStr()}${suffix}.txt`;
}

const FLAG_WL = "★";
const FLAG_SKIP = "?";
const FLAG_DONE = "✓";
const FLAG_WATCH = "👁";
const FLAG_FOLDER = "📁";

/**
 * Serialize the full state to a .txt file (backward-compatible with the
 * original InstaCheck export format).
 */
export function exportState(state: InstaCheckState): string {
  const lines = state.unfollowers.map((u) => {
      const folder = getUserFolder(state, u);
      const watched = state.watched.get(u);
      const flags = [
        state.whitelisted.has(u) ? FLAG_WL : "",
        state.skipped.has(u) ? FLAG_SKIP : "",
        state.checked.has(u) &&
        !state.whitelisted.has(u) &&
        !state.skipped.has(u)
          ? FLAG_DONE
          : "",
        watched ? `${FLAG_WATCH}[${watched.date}]` : "",
        folder ? `${FLAG_FOLDER}[${folder}]` : "",
      ]
        .filter(Boolean)
        .join(" ");
      return flags ? `${flags} ${u}` : u;
  });

  const settings = [`autoWL=${state.autoWhitelistOnFolder}`];
  if (state.followCount) {
    settings.push(`followCount=${state.followCount}`);
  }
  lines.unshift(`#settings ${settings.join(" ")}`);
  return lines.join("\n");
}

/**
 * Parse an exported .txt file back into a full state object.
 * Returns null if the file contains no valid users.
 */
export function importState(text: string): InstaCheckState | null {
  const state: InstaCheckState = {
    following: [],
    followers: [],
    followingText: "",
    followersText: "",
    unfollowers: [],
    checked: new Set(),
    whitelisted: new Set(),
    skipped: new Set(),
    watched: new Map(),
    folders: new Map(),
    followCount: "",
    autoWhitelistOnFolder: false,
    lastUsedFolder: null,
    filterMode: "all",
    sortMode: "az",
    searchQ: "",
    activeFolder: null,
    hasRun: true,
    hydrated: true,
  };

  const raw = text
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

  for (const line of raw) {
    if (line.startsWith("#settings")) {
      const awl = line.match(/autoWL=(true|false)/);
      if (awl) state.autoWhitelistOnFolder = awl[1] === "true";
      const fc = line.match(/followCount=(\d+)/);
      if (fc) state.followCount = fc[1];
      continue;
    }

    let rest = line;
    let isWL = false;
    let isSkip = false;
    let isDone = false;
    let isWatch = false;
    let watchDate = todayStr();
    let folder: string | null = null;

    if (rest.includes(FLAG_WL)) {
      isWL = true;
      rest = rest.split(FLAG_WL).join("").trim();
    }
    if (/(?:^|\s)\?(?:\s|$)/.test(rest)) {
      isSkip = true;
      rest = rest.replace(/(?:^|\s)\?(?:\s|$)/, " ").trim();
    }
    if (rest.includes(FLAG_DONE)) {
      isDone = true;
      rest = rest.split(FLAG_DONE).join("").trim();
    }
    const wm = rest.match(/👁\[([^\]]+)\]/);
    if (wm) {
      isWatch = true;
      watchDate = wm[1];
      rest = rest.replace(wm[0], "").trim();
    }
    const fm = rest.match(/📁\[([^\]]+)\]/);
    if (fm) {
      folder = fm[1];
      rest = rest.replace(fm[0], "").trim();
    }

    const u = rest.toLowerCase().replace(/^@/, "").trim();
    if (!u || !isValidUsername(u)) continue;

    state.unfollowers.push(u);
    if (isWL) state.whitelisted.add(u);
    if (isSkip) state.skipped.add(u);
    if (isDone) state.checked.add(u);
    if (isWatch) state.watched.set(u, { date: watchDate });
    if (folder) {
      if (!state.folders.has(folder)) state.folders.set(folder, new Set());
      state.folders.get(folder)!.add(u);
    }
  }

  if (state.unfollowers.length === 0) return null;
  state.unfollowers.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  return state;
}
