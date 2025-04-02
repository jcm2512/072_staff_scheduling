import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  Auth,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, Firestore, doc, setDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { showNotification } from "@mantine/notifications";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

console.log("APP ID:", import.meta.env.VITE_FIREBASE_APP_ID);
console.log(firebaseConfig);

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const messaging = getMessaging(app);

const companyId = "companyId02";

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    console.log("FCM Token:", token);

    // Wait until the user is logged in
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenRef = doc(
          db,
          "companies",
          companyId,
          "staff",
          user.uid,
          "tokens",
          token
        );
        await setDoc(tokenRef, {
          token,
          createdAt: new Date(),
          userAgent: navigator.userAgent,
        });
        console.log("Stored token for user:", user.uid);
      }
    });
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? "Notification";
    const body = payload.notification?.body ?? "";

    showNotification({
      title,
      message: body,
      autoClose: 5000,
      color: "teal", // or "blue", "red", etc.
      icon: "🔔", // or use an icon component
    });
  });
};
