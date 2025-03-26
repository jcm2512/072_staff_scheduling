import "@mantine/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "@/auth/AuthProvider.js";
import { App } from "@/App.jsx";
import { theme } from "@/themes/colors.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").then((reg) => {
    console.log("Service Worker registered", reg);
  });
}
