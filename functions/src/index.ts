import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

type TokenMeta = {
  userAgent: string;
  createdAt: string;
};

// Cloud Function side
export const sendPushToUser = functions.https.onCall(async (data, context) => {
  const { tokens, title, body } = data as {
    tokens: Record<string, TokenMeta>;
    title: string;
    body: string;
  };

  if (!tokens || Object.keys(tokens).length === 0 || !title || !body) {
    throw new functions.https.HttpsError("invalid-argument", "Missing fields");
  }

  const payload = {
    data: { title, body },
  };

  try {
    const response = await admin.messaging().sendEach(
      Object.keys(tokens).map((token) => ({
        token,
        ...payload,
      }))
    );

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw new functions.https.HttpsError("internal", "Failed to send push notification");
  }
});
