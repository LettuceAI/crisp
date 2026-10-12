import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./site.css";
import { App } from "./App";
import { toRoute } from "./router";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App route={toRoute(location.pathname)} />
  </StrictMode>
);

/* The dev server serves an empty shell; a built page arrives with its markup. */
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
