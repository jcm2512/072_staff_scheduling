const admin = require("firebase-admin");
const webpush = require("web-push");

const [userId, title, body] = process.argv.slice(2);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();

webpush.setVapidDetails(
  "mailto:contact@shiftori.app",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

(async () => {
  const snap = await db.collection("push_subscriptions").doc(userId).get();
  if (!snap.exists) {
    console.error("No subscription found");
    process.exit(1);
  }
  const subscription = snap.data();
  await webpush.sendNotification(subscription, JSON.stringify({ title, body }));
  console.log("Push sent!");
})();
