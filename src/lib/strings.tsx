import { createContext, useContext, useMemo, type ReactNode } from "react";

/** Every string crisp renders on its own: aria-labels, default prop text and status lines. */
export interface CrispStrings {
  actionBarBack: string;
  alertDismiss: string;
  alertShowDetails: string;
  alertHideDetails: string;
  appBarBack: string;
  appBarSearch: string;
  appBarClearSearch: string;
  appBarCloseSearch: string;
  audioItemPlay: (title: string) => string;
  audioItemPause: (title: string) => string;
  audioItemSeek: (title: string) => string;
  avatarGroupPeople: (count: number) => string;
  avatarPickerRemove: string;
  avatarPickerTitle: string;
  avatarPickerDescription: string;
  avatarPickerCancel: string;
  avatarPickerUse: string;
  avatarPickerZoom: string;
  bannerDismiss: string;
  breadcrumbLabel: string;
  breadcrumbMore: (count: number) => string;
  carouselPosition: (index: number, count: number) => string;
  carouselGoTo: (index: number) => string;
  carouselPrevious: string;
  carouselNext: string;
  chipRemove: string;
  colorPickerCurrent: (value: string) => string;
  colorPickerPick: string;
  colorPickerHex: string;
  comboboxPlaceholder: string;
  comboboxSearch: string;
  comboboxEmpty: string;
  comboboxClear: string;
  commandPaletteLabel: string;
  commandPalettePlaceholder: string;
  commandPaletteEmpty: string;
  commandPaletteEscape: string;
  composerPlaceholder: string;
  composerMessage: string;
  composerAttachment: string;
  composerFile: string;
  composerAttachmentRemove: (name: string | undefined) => string;
  composerAddAttachment: string;
  composerCancelRecording: string;
  composerRecordVoice: string;
  composerStopAndTranscribe: string;
  composerTranscribing: string;
  composerRecording: (elapsed: string) => string;
  composerStop: string;
  composerSend: string;
  composerSending: string;
  composerContinue: string;
  composerSendAsSystem: string;
  confirmTitle: string;
  confirmCancel: string;
  confirmConfirm: string;
  confirmUndone: string;
  copyButtonCopy: string;
  copyButtonCopied: string;
  datePickerPlaceholder: string;
  datePickerPreviousMonth: string;
  datePickerNextMonth: string;
  datePickerTime: string;
  dialogClose: string;
  diffBefore: string;
  diffAfter: string;
  diffChanges: string;
  downloadFailed: string;
  downloadWaiting: string;
  downloadVerifying: string;
  downloadPaused: string;
  downloadProgress: (done: string, total: string) => string;
  downloadSpeed: (rate: string) => string;
  downloadLeftSeconds: (seconds: number) => string;
  downloadLeftMinutes: (minutes: number) => string;
  downloadLeftHours: (hours: string) => string;
  downloadPause: (name: string) => string;
  downloadResume: (name: string) => string;
  downloadRetry: (name: string) => string;
  downloadCancel: (name: string) => string;
  downloadFileCount: (count: number) => string;
  downloadShowFiles: (count: number) => string;
  downloadHideFiles: string;
  downloadFailedCount: (failed: number, total: number) => string;
  downloadFilesDone: (done: number, total: number) => string;
  downloadFailedBadge: (count: number) => string;
  dropzoneOver: string;
  dropzoneIdle: string;
  errorStateTitle: string;
  errorStateRetry: string;
  formSave: string;
  formCancel: string;
  formUnsaved: string;
  formDiscardTitle: string;
  formDiscardMessage: string;
  formDiscardConfirm: string;
  formDiscardCancel: string;
  imageViewerZoomIn: string;
  imageViewerZoomOut: string;
  imageViewerClose: string;
  imageViewerPrevious: string;
  imageViewerNext: string;
  infiniteScrollLoading: string;
  loadingState: string;
  messageScene: string;
  messageSystem: string;
  messagePinned: string;
  messageMenuTitle: string;
  messageReasoning: string;
  messageTyping: string;
  modelSelectPlaceholder: string;
  modelSelectTitle: string;
  modelSelectDefault: string;
  modelSelectVision: string;
  modelSelectAudio: string;
  navPrimary: string;
  navCreate: string;
  navCollapse: string;
  navCollapseSidebar: string;
  navExpandSidebar: string;
  numberInputDecrease: string;
  numberInputIncrease: string;
  paginationLabel: string;
  paginationPrevious: string;
  paginationNext: string;
  paginationPage: (page: number) => string;
  partitionBarFree: string;
  reorderableHandle: (index: number, count: number) => string;
  resizableResize: string;
  searchFieldPlaceholder: string;
  searchFieldClear: string;
  secretInputPaste: string;
  secretInputClear: string;
  secretInputShow: string;
  secretInputHide: string;
  secretInputChecking: string;
  secretInputConnected: string;
  selectMenuPlaceholder: string;
  selectMenuClear: string;
  selectMenuEmpty: string;
  selectMenuSelected: (count: number) => string;
  shelfBack: string;
  shelfForward: string;
  sheetClose: string;
  splitButtonMore: string;
  stepperProgress: (step: number, total: number) => string;
  stepperBackTo: (label: string) => string;
  tableEmpty: string;
  tagInputPlaceholder: string;
  tagInputRemove: (tag: string) => string;
  tagInputLimit: (max: number) => string;
  themeEditorPreset: string;
  themeEditorCustom: string;
  themeEditorDensity: string;
  themeEditorDensityDefault: string;
  themeEditorDensityCompact: string;
  themeEditorRadius: string;
  themeEditorRadiusSharp: string;
  themeEditorRadiusDefault: string;
  themeEditorRadiusRound: string;
  themeEditorReset: string;
  themeEditorDerived: string;
  themeEditorDerivedHint: string;
  themeEditorBody: string;
  themeEditorMuted: string;
  themeEditorAccent: string;
  themeEditorContrast: (label: string, ratio: string, need: number) => string;
  themeEditorSurface: string;
  themeEditorSurfaceHint: string;
  themeEditorForeground: string;
  themeEditorForegroundHint: string;
  themeEditorAccentHint: string;
  themeEditorDanger: string;
  themeEditorDangerHint: string;
  themeEditorWarning: string;
  themeEditorWarningHint: string;
  themeEditorInfo: string;
  themeEditorInfoHint: string;
  themeEditorSecondary: string;
  themeEditorSecondaryHint: string;
  titleBarMinimize: string;
  titleBarMaximize: string;
  titleBarClose: string;
  toastDismiss: string;
  tourLabel: string;
  tourSkip: string;
  tourFinish: string;
  tourBack: string;
  tourNext: string;
  treeCollapse: string;
  treeExpand: string;
}

export const englishStrings: CrispStrings = {
  actionBarBack: "Back",
  alertDismiss: "Dismiss",
  alertShowDetails: "Show details",
  alertHideDetails: "Hide details",
  appBarBack: "Back",
  appBarSearch: "Search",
  appBarClearSearch: "Clear search",
  appBarCloseSearch: "Close search",
  audioItemPlay: (title) => `Play ${title}`,
  audioItemPause: (title) => `Pause ${title}`,
  audioItemSeek: (title) => `Seek ${title}`,
  avatarGroupPeople: (count) => `${count} ${count === 1 ? "person" : "people"}`,
  avatarPickerRemove: "Remove picture",
  avatarPickerTitle: "Frame the picture",
  avatarPickerDescription: "Drag to move, slide to zoom. What's in the circle is the avatar.",
  avatarPickerCancel: "Cancel",
  avatarPickerUse: "Use picture",
  avatarPickerZoom: "Zoom",
  bannerDismiss: "Dismiss",
  breadcrumbLabel: "Breadcrumb",
  breadcrumbMore: (count) => `${count} more levels`,
  carouselPosition: (index, count) => `${index} of ${count}`,
  carouselGoTo: (index) => `Go to slide ${index}`,
  carouselPrevious: "Previous slide",
  carouselNext: "Next slide",
  chipRemove: "Remove",
  colorPickerCurrent: (value) => `Colour, currently ${value}`,
  colorPickerPick: "Pick a colour",
  colorPickerHex: "Hex value",
  comboboxPlaceholder: "Select…",
  comboboxSearch: "Search…",
  comboboxEmpty: "No matches",
  comboboxClear: "Clear",
  commandPaletteLabel: "Command palette",
  commandPalettePlaceholder: "Search or jump to…",
  commandPaletteEmpty: "No matches",
  commandPaletteEscape: "Esc",
  composerPlaceholder: "Send a message…",
  composerMessage: "Message",
  composerAttachment: "Attachment",
  composerFile: "File",
  composerAttachmentRemove: (name) => `Remove ${name ?? "attachment"}`,
  composerAddAttachment: "Add attachment",
  composerCancelRecording: "Cancel recording",
  composerRecordVoice: "Record voice",
  composerStopAndTranscribe: "Stop and transcribe",
  composerTranscribing: "Transcribing",
  composerRecording: (elapsed) => `Recording, ${elapsed}`,
  composerStop: "Stop generating",
  composerSend: "Send message",
  composerSending: "Sending",
  composerContinue: "Let the character continue",
  composerSendAsSystem: "Send · hold to send as system message",
  confirmTitle: "Are you sure?",
  confirmCancel: "Cancel",
  confirmConfirm: "Confirm",
  confirmUndone: "This can't be undone.",
  copyButtonCopy: "Copy",
  copyButtonCopied: "Copied",
  datePickerPlaceholder: "Pick a date",
  datePickerPreviousMonth: "Previous month",
  datePickerNextMonth: "Next month",
  datePickerTime: "Time",
  dialogClose: "Close",
  diffBefore: "Theirs",
  diffAfter: "Yours",
  diffChanges: "Changes",
  downloadFailed: "Download failed",
  downloadWaiting: "Waiting…",
  downloadVerifying: "Verifying…",
  downloadPaused: "Paused",
  downloadProgress: (done, total) => `${done} of ${total}`,
  downloadSpeed: (rate) => `${rate}/s`,
  downloadLeftSeconds: (seconds) => `${seconds}s left`,
  downloadLeftMinutes: (minutes) => `${minutes} min left`,
  downloadLeftHours: (hours) => `${hours} h left`,
  downloadPause: (name) => `Pause ${name}`,
  downloadResume: (name) => `Resume ${name}`,
  downloadRetry: (name) => `Retry ${name}`,
  downloadCancel: (name) => `Cancel ${name}`,
  downloadFileCount: (count) => `${count} files`,
  downloadShowFiles: (count) => `Show ${count} files`,
  downloadHideFiles: "Hide files",
  downloadFailedCount: (failed, total) => `${failed} of ${total} failed`,
  downloadFilesDone: (done, total) => `${done} of ${total} files`,
  downloadFailedBadge: (count) => `${count} failed`,
  dropzoneOver: "Drop to add",
  dropzoneIdle: "Drop a file, or click to choose",
  errorStateTitle: "Couldn't load this",
  errorStateRetry: "Try again",
  formSave: "Save changes",
  formCancel: "Cancel",
  formUnsaved: "Unsaved changes",
  formDiscardTitle: "Discard your changes?",
  formDiscardMessage: "You've edited this since you last saved.",
  formDiscardConfirm: "Discard",
  formDiscardCancel: "Keep editing",
  imageViewerZoomIn: "Zoom in",
  imageViewerZoomOut: "Zoom out",
  imageViewerClose: "Close",
  imageViewerPrevious: "Previous image",
  imageViewerNext: "Next image",
  infiniteScrollLoading: "Loading more",
  loadingState: "Loading…",
  messageScene: "Scene",
  messageSystem: "System",
  messagePinned: "Pinned",
  messageMenuTitle: "Message",
  messageReasoning: "Thought process",
  messageTyping: "Typing",
  modelSelectPlaceholder: "Choose a model",
  modelSelectTitle: "Model",
  modelSelectDefault: "Default",
  modelSelectVision: "Vision",
  modelSelectAudio: "Audio",
  navPrimary: "Primary",
  navCreate: "Create",
  navCollapse: "Collapse",
  navCollapseSidebar: "Collapse sidebar",
  navExpandSidebar: "Expand sidebar",
  numberInputDecrease: "Decrease",
  numberInputIncrease: "Increase",
  paginationLabel: "Pagination",
  paginationPrevious: "Previous page",
  paginationNext: "Next page",
  paginationPage: (page) => `Page ${page}`,
  partitionBarFree: "Free",
  reorderableHandle: (index, count) => `Reorder, item ${index} of ${count}. Alt and arrow keys move it.`,
  resizableResize: "Resize panel",
  searchFieldPlaceholder: "Search",
  searchFieldClear: "Clear search",
  secretInputPaste: "Paste",
  secretInputClear: "Clear",
  secretInputShow: "Show",
  secretInputHide: "Hide",
  secretInputChecking: "Checking…",
  secretInputConnected: "Connected",
  selectMenuPlaceholder: "Select…",
  selectMenuClear: "Clear selection",
  selectMenuEmpty: "Nothing to choose from",
  selectMenuSelected: (count) => `${count} selected`,
  shelfBack: "Scroll back",
  shelfForward: "Scroll forward",
  sheetClose: "Close",
  splitButtonMore: "More actions",
  stepperProgress: (step, total) => `Step ${step} of ${total}`,
  stepperBackTo: (label) => `Back to ${label}`,
  tableEmpty: "Nothing to show",
  tagInputPlaceholder: "Add a tag…",
  tagInputRemove: (tag) => `Remove ${tag}`,
  tagInputLimit: (max) => `Limit of ${max} reached`,
  themeEditorPreset: "Theme preset",
  themeEditorCustom: "Custom",
  themeEditorDensity: "Density",
  themeEditorDensityDefault: "Default",
  themeEditorDensityCompact: "Compact",
  themeEditorRadius: "Corner radius",
  themeEditorRadiusSharp: "Sharp",
  themeEditorRadiusDefault: "Default",
  themeEditorRadiusRound: "Round",
  themeEditorReset: "Reset",
  themeEditorDerived: "Derived",
  themeEditorDerivedHint: "Computed from the values above. Change the foreground and all eleven move with it.",
  themeEditorBody: "Body",
  themeEditorMuted: "Muted",
  themeEditorAccent: "Accent",
  themeEditorContrast: (label, ratio, need) => `${label}: ${ratio}:1 — needs ${need}:1`,
  themeEditorSurface: "Surface",
  themeEditorSurfaceHint: "The page. Decides light or dark on its own.",
  themeEditorForeground: "Foreground",
  themeEditorForegroundHint: "Text, and every fill and line tinted from it.",
  themeEditorAccentHint: "Actions and selection.",
  themeEditorDanger: "Danger",
  themeEditorDangerHint: "Destructive actions and errors.",
  themeEditorWarning: "Warning",
  themeEditorWarningHint: "Needs attention.",
  themeEditorInfo: "Info",
  themeEditorInfoHint: "Neutral notices.",
  themeEditorSecondary: "Secondary",
  themeEditorSecondaryHint: "Generated and AI-authored things.",
  titleBarMinimize: "Minimize",
  titleBarMaximize: "Maximize",
  titleBarClose: "Close window",
  toastDismiss: "Dismiss",
  tourLabel: "Product tour",
  tourSkip: "Skip tour",
  tourFinish: "Got it",
  tourBack: "Back",
  tourNext: "Next",
  treeCollapse: "Collapse",
  treeExpand: "Expand",
};

interface CrispStringsValue {
  strings: CrispStrings;
  locale: string;
}

const defaultValue: CrispStringsValue = { strings: englishStrings, locale: "en" };

const CrispStringsContext = createContext<CrispStringsValue>(defaultValue);

export interface CrispStringsProviderProps {
  /** Only the strings you translate; the rest stay English. */
  strings?: Partial<CrispStrings>;
  /** A BCP 47 tag used by every `Intl` call and the format helpers. Default "en". */
  locale?: string;
  children: ReactNode;
}

/** Translates crisp's built-in text. Without it every component renders English and formats for "en". */
export function CrispStringsProvider({ strings, locale = "en", children }: CrispStringsProviderProps) {
  const value = useMemo(
    () => ({ strings: strings ? { ...englishStrings, ...strings } : englishStrings, locale }),
    [strings, locale],
  );
  return <CrispStringsContext.Provider value={value}>{children}</CrispStringsContext.Provider>;
}

/** The active strings and locale, for components that render their own text with crisp's. */
export function useCrispStrings(): CrispStringsValue {
  return useContext(CrispStringsContext);
}
