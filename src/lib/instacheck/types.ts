export type FilterMode = "all" | "pending" | "done" | "wl" | "skip" | "watch";
export type SortMode = "az" | "za" | "pending";

export interface WatchEntry {
  date: string;
}

export interface InstaCheckState {
  following: string[];
  followers: string[];
  /** Raw text of the two input textareas (persisted for convenience). */
  followingText: string;
  followersText: string;
  unfollowers: string[];
  checked: Set<string>;
  whitelisted: Set<string>;
  skipped: Set<string>;
  watched: Map<string, WatchEntry>;
  folders: Map<string, Set<string>>;
  followCount: string;
  autoWhitelistOnFolder: boolean;
  lastUsedFolder: string | null;
  filterMode: FilterMode;
  sortMode: SortMode;
  searchQ: string;
  activeFolder: string | null;
  /** Whether a comparison has been run and results are visible. */
  hasRun: boolean;
}

export type InstaCheckAction =
  | { type: "run" }
  | { type: "setFollowingText"; v: string }
  | { type: "setFollowersText"; v: string }
  | { type: "toggleCheck"; u: string }
  | { type: "toggleWhitelist"; u: string }
  | { type: "toggleSkip"; u: string }
  | { type: "toggleWatch"; u: string; date: string }
  | { type: "addToFolder"; u: string; folder: string }
  | { type: "removeFromFolder"; u: string }
  | { type: "setFilter"; mode: FilterMode }
  | { type: "setSort"; mode: SortMode }
  | { type: "setSearch"; q: string }
  | { type: "setActiveFolder"; name: string | null }
  | { type: "setFollowCount"; v: string }
  | { type: "setAutoWL"; v: boolean }
  | { type: "resetChecked" }
  | { type: "rescan" }
  | { type: "import"; state: InstaCheckState }
  | { type: "hydrate"; state: InstaCheckState };
