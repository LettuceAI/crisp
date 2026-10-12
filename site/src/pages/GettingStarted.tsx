import { useState } from "react";
import { Alert, Box, CrispStringsProvider, Stack, Tab, TabList, TabPanel, Table, Tabs, Text } from "@lettuceai/crisp";
import { Code } from "../Code";
import { DocPage, Section } from "./Doc";
import { toHref } from "../router";

const peers = [
  { name: "react, react-dom", version: "19 or later" },
  { name: "tailwindcss", version: "4 or later" },
  { name: "framer-motion", version: "12 or later" },
  { name: "lucide-react", version: "1 or later" },
];

const css = `@import "tailwindcss";
@import "@lettuceai/crisp/styles.css";

@source "../node_modules/@lettuceai/crisp/dist";`;

const app = `import { Button, ThemeProvider } from "@lettuceai/crisp";

export function App() {
  return (
    <ThemeProvider>
      <main className="p-6">
        <Button variant="primary">Hello, Crisp</Button>
      </main>
    </ThemeProvider>
  );
}`;

const theme = `import { Button, useTheme } from "@lettuceai/crisp";

export function AccentPicker() {
  const { setColor } = useTheme();

  return (
    <Button onClick={() => setColor("accent", "#38bdf8")}>
      Use blue accent
    </Button>
  );
}`;

const strings = `import { CrispStringsProvider } from "@lettuceai/crisp";

<CrispStringsProvider
  locale="de"
  strings={{
    alertDismiss: "Schließen",
    paginationPage: (page) => \`Seite \${page}\`,
  }}
>
  <App />
</CrispStringsProvider>`;

function InstallTabs() {
  const [manager, setManager] = useState("bun");
  const commands: Record<string, string> = {
    bun: "bun add @lettuceai/crisp react react-dom tailwindcss framer-motion lucide-react",
    npm: "npm install @lettuceai/crisp react react-dom tailwindcss framer-motion lucide-react",
  };
  return (
    <Tabs value={manager} onChange={setManager}>
      <TabList aria-label="Package manager">
        <Tab value="bun">bun</Tab>
        <Tab value="npm">npm</Tab>
      </TabList>
      {Object.entries(commands).map(([name, command]) => (
        <TabPanel key={name} value={name} className="pt-3">
          <Code lang="sh" code={command} label="Terminal" wrap />
        </TabPanel>
      ))}
    </Tabs>
  );
}

export function GettingStarted() {
  return (
    <DocPage title="Getting started" lead="Crisp is a React 19 component library styled with Tailwind CSS v4. Install it, point Tailwind at the package, and wrap the app in ThemeProvider.">
      <Section id="install" title="Install">
        <Stack gap={4}>
          <InstallTabs />
          <Text variant="secondary" className="max-w-prose">
            Your application provides these peer dependencies. Skip any you already have.
          </Text>
          <Table
            caption="Peer dependencies"
            columns={[
              { key: "name", header: "Package", cell: (row) => <Box as="code" className="font-mono text-xs">{row.name}</Box> },
              { key: "version", header: "Required version", cell: (row) => row.version },
            ]}
            rows={peers}
            rowKey={(row) => row.name}
          />
        </Stack>
      </Section>
      <Section id="tailwind" title="Tailwind setup">
        <Stack gap={4}>
          <Text variant="secondary" className="max-w-prose">
            Crisp needs a working Tailwind CSS v4 build. Import its stylesheet after Tailwind and add the package to Tailwind's source scanning.
          </Text>
          <Code lang="css" code={css} label="src/index.css" />
          <Text variant="secondary" className="max-w-prose">
            The <Box as="code" className="font-mono text-sm text-fg">@source</Box> path is relative to your stylesheet; the example assumes it lives in <Box as="code" className="font-mono text-sm text-fg">src/</Box>. Crisp supplies tokens and CSS utilities, while your Tailwind build generates the component classes.
          </Text>
          <Alert tone="info" title="Fonts" description="The stylesheet sets global typography, page colors and focus styles. It uses Inter when available with system fallbacks, and does not load a font file." />
        </Stack>
      </Section>
      <Section id="theme-provider" title="ThemeProvider">
        <Stack gap={4}>
          <Text variant="secondary" className="max-w-prose">
            ThemeProvider applies theme variables to the document root and stores the selected theme in localStorage under <Box as="code" className="font-mono text-sm text-fg">crisp.theme</Box>. It restores the saved theme on startup and falls back to Midnight. Pass <Box as="code" className="font-mono text-sm text-fg">initial</Box> to override that starting selection.
          </Text>
          <Code code={app} label="App.tsx" />
          <Text variant="secondary" className="max-w-prose">
            Inside the provider, <Box as="code" className="font-mono text-sm text-fg">useTheme()</Box> changes colors, radius or density. Six presets are available: Midnight, Ink, Vellum, Paper, Slate and Ember. Use the theme menu in the header of this site to try them.
          </Text>
          <Code code={theme} label="AccentPicker.tsx" />
          <Text variant="secondary" className="max-w-prose">
            See <Box as="a" href={toHref("components/theme-provider")} className="text-accent underline underline-offset-2">ThemeProvider</Box> for the full API, and <Box as="a" href={toHref("foundations")} className="text-accent underline underline-offset-2">Foundations</Box> for the tokens it drives.
          </Text>
        </Stack>
      </Section>
      <Section id="translating" title="Translating Crisp">
        <Stack gap={4}>
          <Text variant="secondary" className="max-w-prose">
            Every string Crisp renders on its own (aria-labels, default prop text, status lines) lives in one typed object, CrispStrings. Wrap the app in CrispStringsProvider and pass only the strings you translate; the rest stay English. Entries that need values are functions.
          </Text>
          <Code code={strings} label="main.tsx" />
          <Text variant="secondary" className="max-w-prose">
            <Box as="code" className="font-mono text-sm text-fg">locale</Box> is a BCP 47 tag. It drives every Intl call, including DatePicker, and the format helpers. Props that already take text (placeholder, backLabel, emptyMessage) still win over the provider. Without a provider everything is English.
          </Text>
          <Box className="max-w-xl">
            <CrispStringsProvider locale="de" strings={{ alertDismiss: "Schließen" }}>
              <Alert tone="info" title="Live: the dismiss button below is translated" description="Its accessible name comes from alertDismiss." onDismiss={() => {}} />
            </CrispStringsProvider>
          </Box>
        </Stack>
      </Section>
    </DocPage>
  );
}
