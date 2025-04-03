import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth, User } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getMessaging,
  getToken,
  // onMessage,
  isSupported,
  Messaging,
} from "firebase/messaging";

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

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

const companyId = "companyId02";

let messaging: Messaging | null = null;

export const initMessaging = async (): Promise<Messaging | null> => {
  const supported = await isSupported();
  if (!supported) {
    console.warn("🔥 FCM not supported in this browser.");
    return null;
  }

  try {
    messaging = getMessaging(app); // ✅ Pass app explicitly
    return messaging;
  } catch (err) {
    console.error("FCM setup failed:", err);
    return null;
  }
};

export const ensureUserDocumentExists = async (user: User) => {
  const userRef = doc(db, "companies", companyId, "users", user.uid);
  console.log("userRef", userRef);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      createdAt: serverTimestamp(), // ✅ Use server timestamp
    });
    console.log("Created user document for", user.uid);
  }
};

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  if (!messaging) {
    console.warn("🔥 Messaging not initialized. Call initMessaging() first.");
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY as string, // ✅ Explicit cast
    });

    console.log("FCM Token:", token);
    const user = auth.currentUser;

    if (user && token) {
      const userRef = doc(db, "companies", companyId, "users", user.uid);

      const tokenData = {
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(), // ✅ Use server timestamp
      };

      await updateDoc(userRef, {
        [`tokens.${token}`]: tokenData,
      });
    }

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
