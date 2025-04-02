import { initializeApp } from "firebase/app";
import {
  getMessaging,
  isSupported,
  onBackgroundMessage,
} from "firebase/messaging/sw";

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

export const initMessaging = async () => {
  const supported = await isSupported();
  if (!supported) {
    console.warn("🔥 FCM not supported in this browser.");
    return null;
  }

  try {
    const messaging = getMessaging();
    // Optional: add your onMessage, getToken logic here
    return messaging;
  } catch (err) {
    console.error("FCM setup failed:", err);
    return null;
  }
};

onBackgroundMessage(messaging, (payload) => {
  console.log("[🔥 FCM background message]", payload);

  const { title, body } = payload.data ?? {};
  if (title && body) {
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192x192.png",
    });
  }
});

// self.__WB_MANIFEST;
