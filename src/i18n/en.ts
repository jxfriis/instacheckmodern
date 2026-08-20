export const en = {
  // Hero
  heroTitle1: "Find those who",
  heroTitleGrad: "don't follow back",
  heroSub: "Paste your lists — we find them in a second. Nothing ever leaves your browser.",

  // Input
  lbl1: "Users you follow",
  lbl2: "Users who follow you",
  placeholder1: "Paste usernames, one per line…",
  placeholder2: "Paste usernames, one per line…",
  or: "or upload a",
  upload: ".txt file",
  clear: "Clear",
  run: "Analyse now",
  analyzing: "Analysing…",
  done: "Done",

  // Thinking trace
  thinkTitle: "Thought",
  thinkSteps: "Steps",
  thinkReasoning: "Reasoning",
  thinkSearch: "Search",
  thinkCoding: "Coding",
  thinkStep1: "Parsed {n} accounts you follow",
  thinkStep2: "Parsed {n} accounts following you",
  thinkStep3: "Diffed the two lists",
  thinkStep4: "Found {n} who don't follow back",
  thinkReason1: "{n} freeloaders detected — brutal",
  thinkReason2: "Flagged 0 names as typos (so far)",
  thinkReason3: "Verdict: cleanup recommended",
  thinkSearch1: "Cross-referenced {n} usernames",
  thinkSearch2: "Stripped @-prefixes & lowercased everything",
  thinkSearch3: "Caught 0 duplicate accounts",
  thinkCode1: "for (u of following) if (!followers.has(u)) hit(u)",
  thinkCode2: "O(n) thanks to Set — beep boop",
  thinkCode3: "Ran 100% in your browser",
  dragDrop: "Drop your .txt here",

  // Upload banner
  uploadingFollowing: "Uploading: Users you follow",
  uploadingFollowers: "Uploading: Users who follow you",

  // Stats
  statAll: "Total",
  statDone: "Unfollowed",
  statLeft: "Remaining",
  statWL: "Whitelist",
  statSkip: "Skipped",
  statWatch: "Watched",

  // Filters / sort
  filterAll: "All",
  filterByFolder: "Show only",
  filterPending: "Pending",
  filterDone: "Unfollowed",
  filterWL: "Whitelist",
  filterSkip: "Skip",
  filterWatch: "Watching",
  search: "Search…",
  sortLbl: "Sort",
  sortAZ: "A–Z",
  sortZA: "Z–A",
  sortPending: "Pending first",

  // Goal
  followLbl: "How many you follow now (optional)",
  goalPlaceholder: "e.g. 1200",
  goalPrefix: "Now at",

  // Actions
  copyAll: "Copy remaining",
  clearDone: "Reset",
  resetTitle: "Reset progress?",
  resetDesc: "This clears all your 'unfollowed' checkmarks. This can't be undone.",
  rescan: "New search",
  newSearchQuestion: "New search?",
  export: "Export",
  import: "Import",

  // Export menu
  exportAll: "All remaining (incl. whitelist)",
  exportNoWL: "Without whitelist",

  // Toasts
  copied: "Copied",
  listCopied: "List copied",
  exported: "Downloaded",
  addedToFolder: "Added to folder",
  removedFromFolder: "Removed from folder",
  folderCreated: "Folder created",
  milestone: "New milestone!",
  mileSub: "You now follow under",

  // Row actions
  open: "Open on Instagram",
  copy: "Copy username",
  wlAdd: "Add to whitelist",
  wlRemove: "Remove from whitelist",
  skipAdd: "Skip (invalid name?)",
  skipRemove: "Remove skip",
  skipTooltip: "Skip — this name looks incorrect.\nWill never be exported or copied.",
  watchAdd: "Add to watch list",
  watchRemove: "Remove from watch list",
  watchTooltip:
    "Watch — keep this username even after\nunfollowing. Always visible in the watch list.",
  folderQuick: "Add to",
  folderNew: "New folder",

  // Empty states
  noResults: "Everyone you follow follows you back",
  noResultsSub: "Your feed is clean — nice work!",
  noMatch: "No results",

  // Folders
  foldersLabel: "Folders",
  watchPanelTitle: "Watch list",
  watchPanelSub: "These are unfollowed but you keep the username.",
  watchUnwatch: "Remove",

  // Folder dialog
  nfTitle: "Choose or create folder",
  nfExistingLbl: "Existing folders",
  nfOrTxt: "or create new",
  nfNewLbl: "New folder",
  nfCancel: "Cancel",
  nfConfirm: "Add",
  nfPlaceholder: "New folder name…",

  // Settings
  autoWLLabel: "Folder → WL",
  autoWLOn: "Folder → WL on",
  autoWLOff: "Folder → WL off",

  // Extension / how-to
  extTitle: "How to get your lists",
  extSub: "Free, safe and easy to use",
  extDesc:
    "To get your lists you need the InstaCheck Chrome extension. It scrapes your following and followers lists directly from Instagram and saves them as .txt files, ready to upload here.",
  extBtn: "Download InstaCheck v2 (.zip)",
  tutLabel: "How to use it",
  phase1: "Installation",
  phase2: "Scrape your lists",
  phase3: "Analyse",
  tutStep1Title: "Download and unzip the file",
  tutStep1Desc:
    "Click the download button above. Unzip the file — you get a folder called instacheck-v2.",
  tutStep2Title: "Open Chrome Extensions",
  tutStep2Desc:
    "Go to chrome://extensions in Chrome. Enable Developer Mode in the top-right corner.",
  tutStep3Title: "Load the extension",
  tutStep3Desc:
    'Click "Load unpacked" and select the instacheck-v2 folder. The extension icon appears in your toolbar.',
  tutStep4Title: "Open Instagram and launch the extension",
  tutStep4Desc:
    "Go to instagram.com. Click the InstaCheck icon in your Chrome toolbar.",
  tutStep5Title: "Scrape your lists",
  tutStep5Desc:
    'Click "Scrape Following" then "Scrape Followers". Wait while the extension fetches all users automatically.',
  tutStep6Title: "Download the .txt files",
  tutStep6Desc:
    'Click "Download Following (.txt)" and "Download Followers (.txt)" to save the two lists to your computer.',
  tutStep7Title: "Upload the files in the fields above",
  tutStep7Desc:
    'Use the "Upload .txt" buttons below each field to load your downloaded files. The lists fill in automatically.',
  tutStep8Title: "Click Analyse and review the list",
  tutStep8Desc:
    'Press "Analyse now" and InstaCheck shows you exactly who does not follow you back.',
  followingUploadLbl: "Upload Following .txt",
  followersUploadLbl: "Upload Followers .txt",

  // Header / theme
  themeLight: "Light",
  themeDark: "Dark",
  themeToggle: "Toggle theme",
  langLabel: "Language",

  // Privacy note
  privacyNote: "Private by design — your data never leaves this browser.",
} satisfies Record<string, string>;

export type Messages = typeof en;
