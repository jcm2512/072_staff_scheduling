import { doc, setDoc, getFirestore } from "firebase/firestore";
import app from "@/firebaseConfig";

const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const firestore = getFirestore(app);

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
    const response = await fetch("https://api.github.com/repos/jcm2512/072_staff_scheduling/actions/workflows/send-push.yml/dispatches", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": `token ${import.meta.env.VITE_GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        ref: "main",
        inputs: { userId, title, body }
      })
    });
  
    if (response.ok) {
      console.log("Push triggered successfully.");
    } else {
      console.error("Failed to trigger push:", await response.json());
    }
  }