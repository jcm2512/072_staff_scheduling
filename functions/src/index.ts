import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Cloud Function side
export const sendPushToUser = functions.https.onCall(async (data, context) => {
  const { tokens, title, body } = data as {
    tokens: string[];
    title: string;
    // message: string;
    body: string;
  };

  if (
    !tokens ||
    Object.keys(tokens).length === 0 ||
    !title ||
    // !message ||
    !body
  ) {
    throw new functions.https.HttpsError("invalid-argument", "Missing fields");
  }

  const payload = {
    data: { title, body },
  };

  try {
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
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send push notification"
    );
  }
});
