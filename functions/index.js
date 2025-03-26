const functions = require("firebase-functions");
const admin = require("firebase-admin");
const webpush = require("web-push");
admin.initializeApp();
const db = admin.firestore();

webpush.setVapidDetails(
  "mailto:contact@shiftori.app",
  "YOUR_PUBLIC_VAPID_KEY",
  "YOUR_PRIVATE_VAPID_KEY"
);

// Manual trigger
exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  const { userId, title, body } = data;
  const subSnap = await db.collection("push_subscriptions").doc(userId).get();
  if (!subSnap.exists) throw new Error("No subscription found");

  const subscription = subSnap.data();
  const payload = JSON.stringify({ title, body });
  await webpush.sendNotification(subscription, payload);
  return { success: true };
});

// Auto trigger on shift update
exports.pushOnShiftChange = functions.firestore
  .document("shifts/{shiftId}")
  .onUpdate(async (change, context) => {
    const shift = change.after.data();
    const userId = shift.assignedTo;
    if (!userId) return null;

    const subSnap = await db.collection("push_subscriptions").doc(userId).get();
    if (!subSnap.exists) return null;

    const subscription = subSnap.data();
    const payload = JSON.stringify({
      title: "Shift Updated!",
      body: "Check your new shift schedule.",
    });
    return webpush.sendNotification(subscription, payload);
  });
