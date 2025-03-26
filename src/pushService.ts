import { doc, setDoc, getFirestore } from "firebase/firestore";
import { httpsCallable, getFunctions } from "firebase/functions";
import app from "@/firebaseConfig";

const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const firestore = getFirestore(app);
const functions = getFunctions(app);

export async function subscribeUser(userId: string) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidKey,
  });

  await setDoc(doc(firestore, "push_subscriptions", userId), subscription.toJSON());
  console.log("Push subscription saved.");
}

export async function triggerPush(userId: string, title: string, body: string) {
  const pushTrigger = httpsCallable(functions, "sendPushNotification");
  await pushTrigger({ userId, title, body });
  console.log("Manual push triggered");
}
