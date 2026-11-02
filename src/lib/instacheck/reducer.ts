import { computeUnfollowers, parseList } from "./parse";
import type { InstaCheckAction, InstaCheckState, WatchEntry } from "./types";

export function createInitialState(): InstaCheckState {
  return {
    following: [],
    followers: [],
    followingText: "",
    followersText: "",
    unfollowers: [],
    checked: new Set<string>(),
    whitelisted: new Set<string>(),
    skipped: new Set<string>(),
    watched: new Map<string, WatchEntry>(),
    folders: new Map<string, Set<string>>(),
    followCount: "",
    autoWhitelistOnFolder: false,
    lastUsedFolder: null,
    filterMode: "all",
    sortMode: "az",
    searchQ: "",
    activeFolder: null,
    hasRun: false,
    hydrated: false,
  };
}

/** Folder contents with `keep` applied; folders left empty disappear. */
function filterFolders(
  folders: Map<string, Set<string>>,
  keep: (u: string) => boolean
) {
  const next = new Map<string, Set<string>>();
  for (const [name, set] of folders) {
    const members = new Set(Array.from(set).filter(keep));
    if (members.size > 0) next.set(name, members);
  }
  return next;
}

export function reducer(
  state: InstaCheckState,
  action: InstaCheckAction
): InstaCheckState {
  switch (action.type) {
    case "run": {
      const following = parseList(state.followingText);
      const followers = parseList(state.followersText);
      const stillFollowing = new Set(following);
      const keep = (u: string) => stillFollowing.has(u);
      return {
        ...state,
        following,
        followers,
        unfollowers: computeUnfollowers(following, followers),
        checked: new Set<string>(),
        whitelisted: new Set(Array.from(state.whitelisted).filter(keep)),
        skipped: new Set(Array.from(state.skipped).filter(keep)),
        folders: filterFolders(state.folders, keep),
        followCount: String(stillFollowing.size),
        filterMode: "all",
        sortMode: "az",
        searchQ: "",
        activeFolder: null,
        hasRun: true,
      };
    }

    case "setFollowingText":
      return { ...state, followingText: action.v };

    case "setFollowersText":
      return { ...state, followersText: action.v };

    case "toggleCheck": {
      const checked = new Set(state.checked);
      if (checked.has(action.u)) checked.delete(action.u);
      else checked.add(action.u);
      return { ...state, checked };
    }

    case "toggleWhitelist": {
      const whitelisted = new Set(state.whitelisted);
      const checked = new Set(state.checked);
      const skipped = new Set(state.skipped);
      if (whitelisted.has(action.u)) whitelisted.delete(action.u);
      else {
        whitelisted.add(action.u);
        checked.delete(action.u);
        skipped.delete(action.u);
      }
      return { ...state, whitelisted, checked, skipped };
    }

    case "toggleSkip": {
      const skipped = new Set(state.skipped);
      const checked = new Set(state.checked);
      const whitelisted = new Set(state.whitelisted);
      if (skipped.has(action.u)) skipped.delete(action.u);
      else {
        skipped.add(action.u);
        checked.delete(action.u);
        whitelisted.delete(action.u);
      }
      return { ...state, skipped, checked, whitelisted };
    }

    case "toggleWatch": {
      const watched = new Map(state.watched);
      if (watched.has(action.u)) watched.delete(action.u);
      else watched.set(action.u, { date: action.date });
      return { ...state, watched };
    }

    case "addToFolder": {
      const folders = filterFolders(state.folders, (u) => u !== action.u);
      const target = folders.get(action.folder) ?? new Set<string>();
      target.add(action.u);
      folders.set(action.folder, target);

      const whitelisted = new Set(state.whitelisted);
      const skipped = new Set(state.skipped);
      if (state.autoWhitelistOnFolder) {
        whitelisted.add(action.u);
        skipped.delete(action.u);
      }

      return {
        ...state,
        folders,
        whitelisted,
        skipped,
        lastUsedFolder: action.folder,
        activeFolder:
          state.activeFolder && folders.has(state.activeFolder)
            ? state.activeFolder
            : null,
      };
    }

    case "removeFromFolder": {
      const folders = filterFolders(state.folders, (u) => u !== action.u);
      return {
        ...state,
        folders,
        activeFolder:
          state.activeFolder && folders.has(state.activeFolder)
            ? state.activeFolder
            : null,
      };
    }

    case "setFilter":
      return { ...state, filterMode: action.mode };

    case "setSort":
      return { ...state, sortMode: action.mode };

    case "setSearch":
      return { ...state, searchQ: action.q };

    case "setActiveFolder":
      return { ...state, activeFolder: action.name };

    case "setFollowCount":
      return { ...state, followCount: action.v };

    case "setAutoWL":
      return { ...state, autoWhitelistOnFolder: action.v };

    case "resetChecked":
      return { ...state, checked: new Set<string>() };

    case "rescan":
      return {
        ...createInitialState(),
        whitelisted: state.whitelisted,
        skipped: state.skipped,
        watched: state.watched,
        folders: state.folders,
        autoWhitelistOnFolder: state.autoWhitelistOnFolder,
        lastUsedFolder: state.lastUsedFolder,
        hydrated: true,
      };

    case "clearAll":
      return { ...createInitialState(), hydrated: true };

    case "restore":
      return action.state;

    case "import":
      return { ...action.state, hasRun: true };

    case "hydrate":
      return action.state;

    default:
      return state;
  }
}

export interface SerializedState {
  following: string[];
  followers: string[];
  followingText: string;
  followersText: string;
  unfollowers: string[];
  checked: string[];
  whitelisted: string[];
  skipped: string[];
  watched: [string, string][];
  folders: [string, string[]][];
  followCount: string;
  autoWhitelistOnFolder: boolean;
  lastUsedFolder: string | null;
  hasRun: boolean;
}

export function serializeState(state: InstaCheckState): SerializedState {
  return {
    following: state.following,
    followers: state.followers,
    followingText: state.followingText,
    followersText: state.followersText,
    unfollowers: state.unfollowers,
    checked: Array.from(state.checked),
    whitelisted: Array.from(state.whitelisted),
    skipped: Array.from(state.skipped),
    watched: Array.from(state.watched, ([u, w]) => [u, w.date] as [string, string]),
    folders: Array.from(state.folders, ([name, set]) => [name, Array.from(set)]),
    followCount: state.followCount,
    autoWhitelistOnFolder: state.autoWhitelistOnFolder,
    lastUsedFolder: state.lastUsedFolder,
    hasRun: state.hasRun,
  };
}

export function deserializeState(data: SerializedState): InstaCheckState {
  return {
    following: data.following ?? [],
    followers: data.followers ?? [],
    followingText: data.followingText ?? "",
    followersText: data.followersText ?? "",
    unfollowers: data.unfollowers ?? [],
    checked: new Set(data.checked ?? []),
    whitelisted: new Set(data.whitelisted ?? []),
    skipped: new Set(data.skipped ?? []),
    watched: new Map((data.watched ?? []).map(([u, d]) => [u, { date: d }])),
    folders: new Map(
      (data.folders ?? []).map(([name, users]) => [name, new Set(users)])
    ),
    followCount: data.followCount ?? "",
    autoWhitelistOnFolder: data.autoWhitelistOnFolder ?? false,
    lastUsedFolder: data.lastUsedFolder ?? null,
    filterMode: "all",
    sortMode: "az",
    searchQ: "",
    activeFolder: null,
    hasRun: data.hasRun ?? false,
    hydrated: true,
  };
}
