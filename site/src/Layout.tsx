import { useEffect, useState, type ReactNode } from "react";
import { Box, Button, Flex, IconButton, ScrollArea, Select, Sheet, Text, useTheme } from "@lettuceai/crisp";
import { ExternalLink, Menu } from "lucide-react";
import { useMounted } from "./mounted";
import { toHref, useNavigate, useRoute } from "./router";
import { SideNav } from "./SideNav";

export const REPO = "https://github.com/LettuceAI/crisp";

const topLinks = [
  { route: "getting-started", label: "Docs" },
  { route: "foundations", label: "Foundations" },
  { route: "components", label: "Components" },
];

function ThemeSwitch() {
  const { theme, presets, setTheme } = useTheme();
  const mounted = useMounted();
  return (
    <Box className="w-32">
      <Select
        aria-label="Theme"
        value={mounted ? theme.id : presets[0].id}
        onChange={(event) => {
          const next = presets.find((preset) => preset.id === event.target.value);
          if (next) setTheme(next);
        }}
        options={presets.map((preset) => ({ value: preset.id, label: preset.name }))}
        className="control-sm"
      />
    </Box>
  );
}

function SiteHeader({ onMenu }: { onMenu: () => void }) {
  const route = useRoute();
  const section = route.split("/")[0];
  return (
    <Box as="header" className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
      <Flex align="center" gap={2} className="mx-auto h-14 max-w-360 px-4 md:px-6">
        <IconButton label="Open navigation" onClick={onMenu} className="-ml-2 md:hidden">
          <Menu size={18} />
        </IconButton>
        <Box as="a" href={toHref("")} className="mr-2 flex items-center rounded-lg px-1 text-lg font-bold tracking-tight text-fg">
          Crisp
        </Box>
        <Box as="nav" aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {topLinks.map((link) => (
            <Box
              key={link.route}
              as="a"
              href={toHref(link.route)}
              aria-current={section === link.route.split("/")[0] || (link.route === "components" && section === "components") ? "page" : undefined}
              className="rounded-lg px-3 py-1.5 text-sm text-fg-3 transition-colors motion-instant hover:bg-fill hover:text-fg aria-[current=page]:text-fg"
            >
              {link.label}
            </Box>
          ))}
        </Box>
        <Box className="flex-1" />
        <ThemeSwitch />
        <Box as="a" href={REPO} target="_blank" rel="noreferrer" className="hidden rounded-lg px-3 py-1.5 text-sm text-fg-3 hover:text-fg sm:inline-flex sm:items-center sm:gap-1.5">
          GitHub
          <ExternalLink size={14} />
        </Box>
      </Flex>
    </Box>
  );
}

function SiteFooter() {
  const navigate = useNavigate();
  return (
    <Box as="footer" className="border-t border-line">
      <Flex wrap align="center" justify="between" gap={4} className="mx-auto max-w-360 px-4 py-6 md:px-6">
        <Text variant="hint">Crisp is MIT licensed and part of LettuceAI.</Text>
        <Flex gap={2}>
          <Button variant="ghost" size="sm" onClick={() => navigate("getting-started")}>
            Get started
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.open(REPO, "_blank", "noopener")} trailing={<ExternalLink size={14} />}>
            Source
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const route = useRoute();
  const home = route === "";
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => setNavOpen(false), [route]);

  return (
    <Box className="flex min-h-dvh flex-col bg-surface text-fg">
      <Box
        as="a"
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </Box>
      <SiteHeader onMenu={() => setNavOpen(true)} />
      <Flex className="mx-auto w-full max-w-360 flex-1">
        <Box as="aside" className={home ? "hidden" : "hidden w-64 shrink-0 border-r border-line md:block"}>
          <Box className="sticky top-14 h-[calc(100dvh-3.5rem)]">
            <ScrollArea bar className="h-full">
              <SideNav />
            </ScrollArea>
          </Box>
        </Box>
        <Box as="main" id="content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {children}
        </Box>
      </Flex>
      <SiteFooter />
      <Sheet open={navOpen} onClose={() => setNavOpen(false)} title="Documentation" size="lg">
        <SideNav />
      </Sheet>
    </Box>
  );
}
