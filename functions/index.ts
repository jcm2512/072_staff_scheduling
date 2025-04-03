import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const sendPushToUser = functions.https.onCall(async (data, context) => {
  const { companyId, userId, title, message, body } = data;

  if (!companyId || !userId || !title || !message || !body) {
    throw new functions.https.HttpsError("invalid-argument", "Missing fields");
  }

  const tokensSnapshot = await admin
    .firestore()
    .collection("companies")
    .doc(companyId)
    .collection("users")
    .doc(userId)
    .collection("tokens")
    .get();

  const tokens = tokensSnapshot.docs.map((doc) => doc.id);

  if (tokens.length === 0) {
    throw new functions.https.HttpsError("not-found", "No tokens available");
  }

  const payload = {
    data: {
      title,
      message,
      body,
    },
  };

  const response = await admin.messaging().sendEach(
    tokens.map((token) => ({
      token,
      ...payload,
    }))
  );

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
  };
});
