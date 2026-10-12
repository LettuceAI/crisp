import { ThemeProvider } from "@lettuceai/crisp";
import { Router, useRoute } from "./router";

function Page() {
  const route = useRoute();
  return <main id="content">{route || "home"}</main>;
}

export function App({ route }: { route: string }) {
  return (
    <ThemeProvider>
      <Router initial={route}>
        <Page />
      </Router>
    </ThemeProvider>
  );
}
