export interface Entry {
  /** The page title, and the file in `examples/` that drives it. */
  name: string;
  /** Every export this page documents; defaults to `[name]`. */
  docs?: string[];
  /** Shown when the source has no doc comment for the export. */
  summary?: string;
  slug: string;
}

export interface Group {
  id: string;
  title: string;
  blurb: string;
  items: Entry[];
}

function slugOf(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .replace(/^-|-$/g, "");
}

type Spec = string | [name: string, ...docs: string[]] | { name: string; docs?: string[]; summary?: string };

function entry(spec: Spec): Entry {
  if (typeof spec === "string") return { name: spec, slug: slugOf(spec) };
  if (Array.isArray(spec)) {
    const [name, ...docs] = spec;
    return { name, docs: [name, ...docs], slug: slugOf(name) };
  }
  return { name: spec.name, docs: spec.docs, summary: spec.summary, slug: slugOf(spec.name) };
}

function group(id: string, title: string, blurb: string, specs: Spec[]): Group {
  return { id, title, blurb, items: specs.map(entry) };
}

export const groups: Group[] = [
  group("layout", "Layout", "Primitives that arrange things, and the frames that hold a whole screen.", [
    "Box",
    "Center",
    "Container",
    "Divider",
    ["Flex", "gapClass", "alignClass", "justifyClass"],
    "Grid",
    "Spacer",
    ["Stack", "VStack", "HStack"],
    "AspectRatio",
    "VisuallyHidden",
    "AppShell",
    "Page",
    ["Card", "CardButton"],
    "Panel",
    ["Surface", "useOnSurface"],
    "ScrollArea",
    "Resizable",
    "Masonry",
  ]),
  group("navigation", "Navigation", "Where you are and where you can go, on a phone and on a desktop.", [
    "AppBar",
    ["NavRail", "NavLabel", "useNavExpanded"],
    ["TabBar", "NavBadge"],
    "Dock",
    ["Tabs", "TabList", "Tab", "TabPanel"],
    "Breadcrumb",
    "Pagination",
    "Stepper",
    "FilterBar",
    ["Toolbar", "ToolbarGroup", "ToolbarSeparator"],
    ["TitleBar", "WindowResizeHandles"],
    "Carousel",
    "Shelf",
  ]),
  group("actions", "Actions", "Things you press, and small controls that sit beside them.", [
    ["Button", "iconSize"],
    ["ButtonGroup", "SplitButton"],
    "IconButton",
    "CopyButton",
    "Chip",
    "Kbd",
  ]),
  group("forms", "Forms", "Inputs, pickers and the plumbing that holds a form's values.", [
    ["Field", "useFieldContext"],
    ["Form", "FormActions", "useForm", "useUnsavedGuard"],
    ["Input", "Textarea", "inputSurface"],
    "Select",
    "SelectMenu",
    "Combobox",
    "Checkbox",
    ["Radio", "RadioGroup"],
    "Switch",
    "Slider",
    "NumberInput",
    "SearchField",
    "SecretInput",
    "TagInput",
    "OtpInput",
    ["DatePicker", "Calendar"],
    "ColorPicker",
    "Segmented",
    "ToggleGroup",
    "Dropzone",
  ]),
  group("overlays", "Overlays", "Surfaces that float above the page: the bottom sheet first, then everything else.", [
    ["Sheet", "BottomMenu"],
    "Dialog",
    ["Popover", "PopoverTrigger", "PopoverAnchor", "PopoverContent", "usePopoverPosition"],
    ["Menu", "MenuTrigger", "MenuContent", "MenuItem", "MenuSeparator", "MenuLabel"],
    "ContextMenu",
    "HoverCard",
    "Tooltip",
    ["CommandPalette", "useCommandPalette"],
    "Tour",
    ["Confirm", "confirm", "ConfirmHost"],
  ]),
  group("feedback", "Feedback", "Telling the person what is happening, what happened and what to do.", [
    "Alert",
    "Banner",
    ["Toast", "Toaster", "toast"],
    "Progress",
    "Meter",
    "PartitionBar",
    ["Spinner", "LoadingState"],
    ["Skeleton", "SkeletonRow"],
    ["EmptyState", "ErrorState"],
    "Badge",
  ]),
  group("data", "Data and content", "Lists, tables, charts and text that is read rather than operated.", [
    "Text",
    "Prose",
    "CodeBlock",
    ["Diff", "diffLines"],
    "Highlight",
    "Icon",
    ["List", "ListGroup", "ListRow", "ListRowButton"],
    ["Accordion", "AccordionItem"],
    "Collapsible",
    ["StatTile", "KeyValue"],
    "Table",
    "Tree",
    "Timeline",
    "VirtualList",
    "InfiniteScroll",
    ["Chart", "Sparkline", "ChartCell", "CHART_SERIES"],
    "Citation",
  ]),
  group("media", "Media and chat", "Cards, players and the conversation itself.", [
    "Avatar",
    "AvatarGroup",
    "AvatarPicker",
    ["MediaCard", "MediaCardSkeleton"],
    ["MediaTile", "MediaTileSkeleton"],
    ["CharacterCard", "CharacterCardSkeleton"],
    "AudioItem",
    "DownloadItem",
    "MultiItemDownloadCard",
    "ImageViewer",
    ["Message", "TypingDots", "MessageDivider"],
    ["Composer", "RecordingWave"],
    "FeedbackAction",
    "PromptSuggestions",
  ]),
  group("flows", "Flows and setup", "Multi-step screens, first-run choices and setting things up.", [
    ["Wizard", "useWizard"],
    "ActionBar",
    "ChoiceCard",
    "ModelSelect",
    "ReorderableList",
    "ThemeEditor",
  ]),
  group("utilities", "Utilities and hooks", "Theming, translation, formatting and the hooks components are built on.", [
    ["ThemeProvider", "useTheme", "PRESETS", "DEFAULT_THEME", "themeToVars", "applyTheme"],
    ["CrispStringsProvider", "useCrispStrings", "englishStrings"],
    ["cn", "mergeRefs", "getElementRef"],
    ["Format helpers", "relativeTime", "compactNumber", "fileSize"],
    ["Color helpers", "hexToRgb", "normaliseHex", "luminance", "contrastRatio", "isLight", "readableOn", "mixHex", "tintFromName"],
    ["Media and gesture hooks", "useMediaQuery", "useCompactLayout", "useModal", "useLongPress", "useImageBrightness"],
    ["FrameProvider", "useFrame", "usePortalTarget"],
  ]),
];

/** Exports the foundations page documents instead of a component page. */
export const foundationSymbols = ["icon", "motion"];

export const entries: Entry[] = groups.flatMap((g) => g.items);

export function groupOf(slug: string) {
  return groups.find((g) => g.items.some((item) => item.slug === slug));
}

export function docsOf(item: Entry) {
  return item.docs ?? [item.name];
}

export function documentedNames() {
  return new Set([...entries.flatMap(docsOf), ...foundationSymbols]);
}
