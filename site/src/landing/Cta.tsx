import { ArrowRight } from "lucide-react";
import { Box, Button, CodeBlock, Text } from "@lettuceai/crisp";
import { useNavigate } from "../router";
import { Reveal } from "./Band";

const snippet = `import { Button, ThemeProvider } from "@lettuceai/crisp";

export function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Hello, Crisp</Button>
    </ThemeProvider>
  );
}`;

export function Cta() {
  const navigate = useNavigate();
  return (
    <Box as="section" aria-labelledby="cta-title" className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 md:px-6">
      <Reveal>
        <Box className="grid items-center gap-8 rounded-2xl border border-line bg-surface-1 p-6 md:p-10 lg:grid-cols-2">
          <Box className="flex flex-col gap-4">
            <Text variant="display" as="h2" id="cta-title" className="text-3xl md:text-4xl">Start with one import.</Text>
            <Text variant="secondary" className="text-lg">Install, add the stylesheet, and wrap the app in ThemeProvider. The rest is components.</Text>
            <Box className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={() => navigate("getting-started")} trailing={<ArrowRight size={18} />}>Read the setup guide</Button>
              <Button size="lg" onClick={() => navigate("components")}>Browse components</Button>
            </Box>
          </Box>
          <CodeBlock code={snippet} label="App.tsx" maxHeight={260} />
        </Box>
      </Reveal>
    </Box>
  );
}
