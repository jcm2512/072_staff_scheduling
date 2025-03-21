// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDUwpC91bzct8dexj8NBvhWJ-v_nsxIcx8",
  projectId: "shiftori",
  messagingSenderId: "77806310535",
  appId: "1:77806310535:web:6b4f0d31f97a04d9b79422",
});

const messaging = firebase.messaging();

// Background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Push received:", payload);

  const notificationTitle = payload.notification?.title || "SHIFTORI";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new shift update!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: { url: payload.data?.url || "/" }, // Ensure deep linking works
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click (deep linking)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});
