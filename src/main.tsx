import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@/presentation/providers/QueryProvider";
import { CinetecaProvider } from "@/presentation/providers/CinetecaProvider";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <CinetecaProvider>
        <App />
      </CinetecaProvider>
    </QueryProvider>
  </StrictMode>,
);
