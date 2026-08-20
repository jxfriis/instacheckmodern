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

export function getDoneCount(state: InstaCheckState): number {
  return state.unfollowers.filter(
    (u) =>
      state.checked.has(u) &&
      !state.whitelisted.has(u) &&
      !state.skipped.has(u)
  ).length;
}

export function getRemainingCount(state: InstaCheckState): number {
  return state.unfollowers.filter(
    (u) =>
      !state.checked.has(u) &&
      !state.whitelisted.has(u) &&
      !state.skipped.has(u)
  ).length;
}

export function getProgress(state: InstaCheckState): number {
  const wlCount = state.whitelisted.size;
  const skipCount = state.skipped.size;
  const nonWLTotal = state.unfollowers.length - wlCount - skipCount;
  if (nonWLTotal <= 0) return 0;
  return Math.round((getDoneCount(state) / nonWLTotal) * 100);
}

/** Remaining to reach the user's "following now" goal, or null if no goal. */
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
      if (
        !state.checked.has(u) &&
        !state.whitelisted.has(u) &&
        !state.skipped.has(u)
      )
        return 0;
      if (state.whitelisted.has(u)) return 1;
      if (state.skipped.has(u)) return 2;
      return 3;
    };
    return list.sort((a, b) => rank(a) - rank(b) || byUsername(a, b));
  }
  return list.sort(byUsername);
}

export function getVisible(state: InstaCheckState): string[] {
  const filtered = state.unfollowers.filter((u) => {
    const isWatch = state.watched.has(u);
    if (state.filterMode === "watch") {
      return (
        isWatch &&
        (!state.searchQ || u.includes(state.searchQ)) &&
        (!state.activeFolder || state.folders.get(state.activeFolder)?.has(u))
      );
    }
    if (
      state.filterMode === "pending" &&
      ((!isWatch && state.checked.has(u)) ||
        state.whitelisted.has(u) ||
        state.skipped.has(u))
    )
      return false;
    if (
      state.filterMode === "done" &&
      (!state.checked.has(u) ||
        state.whitelisted.has(u) ||
        state.skipped.has(u))
    )
      return false;
    if (state.filterMode === "wl" && !state.whitelisted.has(u)) return false;
    if (state.filterMode === "skip" && !state.skipped.has(u)) return false;
    if (
      state.activeFolder &&
      !state.folders.get(state.activeFolder)?.has(u)
    )
      return false;
    if (state.searchQ && !u.includes(state.searchQ)) return false;
    return true;
  });
  return getSorted(state, filtered);
}

/** Counts shown on the filter pills. */
export function getFilterCounts(state: InstaCheckState) {
  const doneCount = getDoneCount(state);
  const remaining = getRemainingCount(state);
  return {
    all: state.unfollowers.length,
    pending: remaining,
    done: doneCount,
    wl: state.whitelisted.size,
    skip: state.skipped.size,
    watch: state.watched.size,
  };
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
