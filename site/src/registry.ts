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

const summaries: Record<string, string> = {
  "Center": "Centers its children on both axes. For empty areas, loaders and badges.",
  "Container": "A centered column with a maximum width and horizontal padding. Sizes run from sm (640px) to xl (1280px), plus a 65ch reading column.",
  "Divider": "A line between things, horizontal or vertical, optionally with text set into it.",
  "Flex": "A flex row or column with gap, alignment and wrapping as props. Reach for Stack when you only need vertical rhythm.",
  "Grid": "A CSS grid with responsive column counts, or auto-fit columns from a minimum width for card grids that should just flow.",
  "Card": "A surface for grouped content. Elevation separates it from the page. CardButton is the clickable version and is a real button.",
  "Button": "The standard action. Five variants from the single high-emphasis primary to ghost and danger, three sizes, a loading state and leading or trailing icons.",
  "ButtonGroup": "Joins buttons into one attached control. SplitButton pairs a primary action with a menu of alternatives behind a chevron.",
  "IconButton": "A button with only an icon. It requires a label, which becomes its accessible name.",
  "Kbd": "A keyboard key cap, for shortcuts shown in text and menus.",
  "Field": "Wraps one control with its label, hint and error message, and wires the ids so assistive technology reads them together.",
  "Input": "A text field with optional leading and trailing slots. Textarea is the multi-line version and can grow with its text.",
  "Checkbox": "A checkbox with an inline label and an indeterminate state for the parent of a mixed list.",
  "Switch": "An on/off toggle that takes effect immediately. Use a Checkbox when the choice is submitted with a form.",
  "Slider": "A native range input on Crisp's track, with an optional value readout.",
  "Segmented": "Picks exactly one of a few peer options. For any number of selections use ToggleGroup; for views of one thing use Tabs.",
  "Sheet": "The signature overlay: a bottom sheet with drag-to-dismiss, optional resting heights (detents), a header and a footer. Dialog is for short centred modals.",
  "Confirm": "`await confirm({...})` opens a confirmation from anywhere and resolves true or false. Mount ConfirmHost once at the app root.",
  "Toast": "Notifications. Mount Toaster once, then call `toast.success()`, `toast.error()` and the others, or `toast.progress()` for long-running work.",
  "Progress": "How far along something is, as a bar. Omit the value for an indeterminate state. Meter is for a budget being spent.",
  "Skeleton": "A placeholder shaped like the content that is loading, as text, block or circle. SkeletonRow is a ready-made list row.",
  "Badge": "A small read-only label with a semantic tone and an optional status dot. Chip is the tappable version.",
  "Text": "The type roles. Every piece of text uses one of ten variants, from hero to caption, rendered as a fitting element.",
  "Icon": "A lucide icon at a step on the icon ladder, decorative unless you give it a label.",
  "List": "Grouped rows for settings and navigation. ListGroup frames them, ListRow shows a value or a control, and ListRowButton is a tappable row with a chevron.",
  "Accordion": "A set of disclosures that share open state, one at a time or several together.",
  "Avatar": "A person or character picture that falls back to initials on a tint derived from the name. Five sizes and an accent ring for the active state.",
  "AvatarGroup": "Overlapping avatars with a +N counter past a maximum.",
  "Message": "One chat message for users, assistants, scenes and system notes. It handles streaming and typing states, visible reasoning, regeneration variants, grouping into runs and a long-press menu.",
  "Composer": "The chat message box: an input that grows, attachments, a microphone with a live waveform, and a send button that turns into stop while a reply is coming.",
  "ThemeProvider": "Applies the active theme to the document and persists it. useTheme changes colors, radius and density.",
  "cn": "Merges conditional class names and resolves Tailwind conflicts, so a className you pass wins over a component's default. mergeRefs and getElementRef compose refs.",
  "Format helpers": "relativeTime, compactNumber and fileSize: the numbers a list shows, formatted one way everywhere and aware of the locale.",
  "Color helpers": "Pure hex helpers for contrast, readability and mixing, plus tintFromName for a stable color per name.",
  "Media and gesture hooks": "useMediaQuery and useCompactLayout for responsive logic, useLongPress for holds, useModal for focus and scroll locking in overlays, and useImageBrightness for text over images."
};

function entry(spec: Spec): Entry {
  const made = make(spec);
  return { ...made, summary: made.summary ?? summaries[made.name] };
}

function make(spec: Spec): Entry {
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
    ["Icon", "ICON_SIZE"],
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
