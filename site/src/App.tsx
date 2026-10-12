import { ThemeProvider } from "@lettuceai/crisp";
import { Layout } from "./Layout";
import { ComponentPage } from "./pages/ComponentPage";
import { ComponentsIndex } from "./pages/ComponentsIndex";
import { Foundations } from "./pages/Foundations";
import { GettingStarted } from "./pages/GettingStarted";
import { NotFound } from "./pages/NotFound";
import { entries } from "./registry";
import { Router, useRoute } from "./router";

function Content() {
  const route = useRoute();
  if (route === "" || route === "getting-started") return <GettingStarted />;
  if (route === "foundations") return <Foundations />;
  if (route === "components") return <ComponentsIndex />;
  const item = route.startsWith("components/") ? entries.find((entry) => `components/${entry.slug}` === route) : undefined;
  return item ? <ComponentPage item={item} /> : <NotFound />;
}

export function App({ route }: { route: string }) {
  return (
    <ThemeProvider>
      <Router initial={route}>
        <Layout>
          <Content />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
