"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { MILESTONES, STORAGE_KEY } from "@/lib/instacheck/constants";
import {
  createInitialState,
  deserializeState,
  reducer,
  serializeState,
} from "@/lib/instacheck/reducer";
import {
  getExportable,
  getGoalRemaining,
  getProgress,
  getVisible,
} from "@/lib/instacheck/selectors";
import { exportFileName, exportState, importState } from "@/lib/instacheck/format";
import type { FilterMode, InstaCheckState, SortMode } from "@/lib/instacheck/types";

import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/hooks/use-toast";
import { useEffects } from "@/hooks/use-effects";

export function useInstaCheck() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { milestoneBurst } = useEffects();

  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const hydratedRef = useRef(false);
  const lastMilestone = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "hydrate", state: deserializeState(JSON.parse(raw)) });
      }
    } catch {
      /* ignore corrupt storage */
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(serializeState(state))
      );
    } catch {
      /* ignore quota errors */
    }
  }, [state]);

  const run = useCallback(() => {
    dispatch({ type: "run" });
    lastMilestone.current = null;
  }, []);

  const toggleCheck = useCallback(
    (u: string) => {
      const isAdd = !state.checked.has(u);
      if (!isAdd) {
        dispatch({ type: "toggleCheck", u });
        return;
      }
      dispatch({ type: "toggleCheck", u });

      const prevFc = getGoalRemaining(state);
      if (prevFc !== null) {
        const nextFc = Math.max(prevFc - 1, 0);
        for (const m of MILESTONES) {
          if (nextFc + 1 >= m && nextFc < m && lastMilestone.current !== m) {
            lastMilestone.current = m;
            milestoneBurst();
            toast(t.milestone, `${t.mileSub} ${m}!`, 4000);
            break;
          }
        }
      }
    },
    [state, t, milestoneBurst, toast]
  );

  const toggleWhitelist = useCallback(
    (u: string) => dispatch({ type: "toggleWhitelist", u }),
    []
  );
  const toggleSkip = useCallback(
    (u: string) => dispatch({ type: "toggleSkip", u }),
    []
  );
  const toggleWatch = useCallback(
    (u: string, date: string) => dispatch({ type: "toggleWatch", u, date }),
    []
  );

  const addToFolder = useCallback(
    (u: string, folder: string) => {
      dispatch({ type: "addToFolder", u, folder });
      toast(t.addedToFolder, folder);
    },
    [t, toast]
  );

  const removeFromFolder = useCallback(
    (u: string) => {
      dispatch({ type: "removeFromFolder", u });
      toast(t.removedFromFolder);
    },
    [t, toast]
  );

  const setFilter = useCallback(
    (mode: FilterMode) => dispatch({ type: "setFilter", mode }),
    []
  );
  const setSort = useCallback(
    (mode: SortMode) => dispatch({ type: "setSort", mode }),
    []
  );
  const setSearch = useCallback(
    (q: string) => dispatch({ type: "setSearch", q }),
    []
  );
  const setActiveFolder = useCallback(
    (name: string | null) => dispatch({ type: "setActiveFolder", name }),
    []
  );
  const setFollowCount = useCallback(
    (v: string) => dispatch({ type: "setFollowCount", v }),
    []
  );
  const setFollowingText = useCallback(
    (v: string) => dispatch({ type: "setFollowingText", v }),
    []
  );
  const setFollowersText = useCallback(
    (v: string) => dispatch({ type: "setFollowersText", v }),
    []
  );
  const setAutoWL = useCallback(
    (v: boolean) => dispatch({ type: "setAutoWL", v }),
    []
  );

  const toggleAutoWL = useCallback(() => {
    dispatch({ type: "setAutoWL", v: !state.autoWhitelistOnFolder });
    toast(state.autoWhitelistOnFolder ? t.autoWLOff : t.autoWLOn);
  }, [state.autoWhitelistOnFolder, t, toast]);

  const resetChecked = useCallback(
    () => dispatch({ type: "resetChecked" }),
    []
  );

  const rescan = useCallback(() => {
    dispatch({ type: "rescan" });
    lastMilestone.current = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const importFromFile = useCallback(
    (text: string): boolean => {
      const parsed = importState(text);
      if (!parsed) {
        toast(t.noMatch);
        return false;
      }
      dispatch({ type: "import", state: parsed });
      lastMilestone.current = null;
      return true;
    },
    [t, toast]
  );

  const download = useCallback((filename: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportFile = useCallback(
    (includeWL: boolean, includeFollowCount = false) => {
      download(
        exportFileName(),
        exportState(state, includeWL, includeFollowCount)
      );
      toast(t.exported);
    },
    [state, download, t, toast]
  );

  const copyRemaining = useCallback(() => {
    const list = getExportable(state, true);
    navigator.clipboard
      .writeText(list.join("\n"))
      .then(() => toast(t.listCopied))
      .catch(() => toast(t.noMatch));
  }, [state, t, toast]);

  const copyUsername = useCallback(
    (u: string) => {
      navigator.clipboard
        .writeText(u)
        .then(() => toast(t.copied))
        .catch(() => {});
    },
    [t, toast]
  );

  const visible = useMemo(() => getVisible(state), [state]);

  return {
    state,
    visible,
    progress: getProgress(state),
    goalRemaining: getGoalRemaining(state),
    actions: {
      run,
      toggleCheck,
      toggleWhitelist,
      toggleSkip,
      toggleWatch,
      addToFolder,
      removeFromFolder,
      setFilter,
      setSort,
      setSearch,
      setActiveFolder,
      setFollowCount,
      setFollowingText,
      setFollowersText,
      setAutoWL,
      toggleAutoWL,
      resetChecked,
      rescan,
      importFromFile,
      exportFile,
      copyRemaining,
      copyUsername,
    },
  };
}

export type InstaCheckApi = ReturnType<typeof useInstaCheck>;
export type { InstaCheckState };
