import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Firebase config copied directly (Vite env vars not usable in SW)
const firebaseConfig = {
  apiKey: "AIzaSyDUwpC91bzct8dexj8NBvhWJ-v_nsxIcx8",
  authDomain: "shiftori.firebaseapp.com",
  projectId: "shiftori",
  storageBucket: "shiftori.firebasestorage.app",
  messagingSenderId: "77806310535",
  appId: "1:77806310535:web:6b4f0d31f97a04d9b79422",
  measurementId: "G-24RF3RGZ7W",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  const notificationTitle = payload.data?.title || "SHIFTORI";
  const notificationOptions = {
    message: payload.data?.message || "Default Message",
    body: payload.data?.body || "You have a new message.",
    icon: "/icons/icon-192x192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
