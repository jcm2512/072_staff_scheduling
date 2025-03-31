import "@mantine/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "@/auth/AuthProvider.js";
import { App } from "@/App.jsx";
import { theme } from "@/themes/colors.jsx";
import { BrowserRouter } from "react-router-dom";

import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="top-left" zIndex={1984} />

      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
