import type { FilterMode, InstaCheckState, SortMode } from "./types";

export function getUserFolder(
  state: InstaCheckState,
  u: string
): string | null {
  for (const [name, set] of state.folders) {
    if (set.has(u)) return name;
  }
  return null;
}

function isPending(state: InstaCheckState, u: string) {
  return (
    !state.checked.has(u) && !state.whitelisted.has(u) && !state.skipped.has(u)
  );
}

function isDone(state: InstaCheckState, u: string) {
  return (
    state.checked.has(u) && !state.whitelisted.has(u) && !state.skipped.has(u)
  );
}

export function getDoneCount(state: InstaCheckState): number {
  return state.unfollowers.filter((u) => isDone(state, u)).length;
}

export function getRemainingCount(state: InstaCheckState): number {
  return state.unfollowers.filter((u) => isPending(state, u)).length;
}

export function getProgress(state: InstaCheckState): number {
  const done = getDoneCount(state);
  const total = done + getRemainingCount(state);
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

/** What the user follows now: the count at the start minus those unfollowed since. */
export function getGoalRemaining(state: InstaCheckState): number | null {
  if (state.followCount === "") return null;
  return Math.max(Number(state.followCount) - getDoneCount(state), 0);
}

export function getExportable(
  state: InstaCheckState,
  includeWL: boolean
): string[] {
  return state.unfollowers.filter((u) => {
    if (state.skipped.has(u)) return false;
    if (state.checked.has(u) && !state.whitelisted.has(u)) return false;
    if (!includeWL && state.whitelisted.has(u)) return false;
    return true;
  });
}

function byUsername(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function getSorted(
  state: InstaCheckState,
  arr: string[],
  sortMode: SortMode = state.sortMode
): string[] {
  const list = [...arr];
  if (sortMode === "za") return list.sort((a, b) => byUsername(b, a));
  if (sortMode === "pending") {
    const rank = (u: string) => {
      if (isPending(state, u)) return 0;
      if (state.whitelisted.has(u)) return 1;
      if (state.skipped.has(u)) return 2;
      return 3;
    };
    return list.sort((a, b) => rank(a) - rank(b) || byUsername(a, b));
  }
  return list.sort(byUsername);
}

function matchesFilter(state: InstaCheckState, u: string) {
  switch (state.filterMode) {
    case "pending":
      return isPending(state, u);
    case "done":
      return isDone(state, u);
    case "wl":
      return state.whitelisted.has(u);
    case "skip":
      return state.skipped.has(u);
    case "watch":
      return state.watched.has(u);
    default:
      return true;
  }
}

export function getVisible(state: InstaCheckState): string[] {
  const q = state.searchQ.trim().toLowerCase().replace(/^@/, "");
  const filtered = state.unfollowers.filter(
    (u) =>
      matchesFilter(state, u) &&
      (!state.activeFolder || state.folders.get(state.activeFolder)?.has(u)) &&
      (!q || u.includes(q))
  );
  return getSorted(state, filtered);
}

/** The next account to deal with, in the order the list is sorted. */
export function getNextUp(state: InstaCheckState): string | null {
  const pending = state.unfollowers.filter((u) => isPending(state, u));
  return getSorted(state, pending)[0] ?? null;
}

/** Counts shown on the filters. Decisions carried over can name accounts no longer in the list. */
export function getFilterCounts(state: InstaCheckState) {
  const inList = (has: (u: string) => boolean) =>
    state.unfollowers.filter(has).length;
  return {
    all: state.unfollowers.length,
    pending: getRemainingCount(state),
    done: getDoneCount(state),
    wl: inList((u) => state.whitelisted.has(u)),
    skip: inList((u) => state.skipped.has(u)),
    watch: inList((u) => state.watched.has(u)),
  };
}

export function getFolderCount(state: InstaCheckState, name: string): number {
  const folder = state.folders.get(name);
  return folder ? state.unfollowers.filter((u) => folder.has(u)).length : 0;
}

/** How many choices from an earlier comparison would carry over to the next one. */
export function getRememberedCount(state: InstaCheckState): number {
  const inFolders = Array.from(state.folders.values()).reduce(
    (sum, set) => sum + set.size,
    0
  );
  return (
    state.whitelisted.size + state.skipped.size + state.watched.size + inFolders
  );
}

export const FILTER_MODES: FilterMode[] = [
  "all",
  "pending",
  "done",
  "wl",
  "skip",
  "watch",
];

export const SORT_MODES: SortMode[] = ["az", "za", "pending"];
