import "@mantine/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "@/auth/AuthProvider.js";
import { App } from "@/App.jsx";
import { theme } from "@/themes/colors.jsx";
import app, { messaging } from "@/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";
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

// PWA Service Worker Registration + FCM Token setup
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
      // Use registration for advanced use
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          }).then((token) => {
            console.log("FCM Token:", token);
            // TODO: Save token to Firestore if needed
          });
        }
      });
    });
}

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log("Foreground message received:", payload);
});
