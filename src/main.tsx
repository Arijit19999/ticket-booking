import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1e293b",
          border: "1px solid #334155",
          color: "#e2e8f0",
          fontSize: "13px",
        },
      }}
      richColors
      closeButton
    />
  </StrictMode>,
);
