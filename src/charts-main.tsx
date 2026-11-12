import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChartsPage } from "./charts/ChartsPage";
import "./index.css";

createRoot(document.getElementById("chart-root")!).render(
  <StrictMode>
    <ChartsPage />
  </StrictMode>,
);
