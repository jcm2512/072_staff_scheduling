import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const sendPushToUser = functions.https.onCall(async (data, context) => {
  const { companyId, userId, title, message, body } = data;

  if (!companyId || !userId || !title || !message || !body) {
    throw new functions.https.HttpsError("invalid-argument", "Missing fields");
  }

  try {
    // Retrieve the user document
    const userDoc = await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .collection("users")
      .doc(userId)
      .get();

    // Retrieve the tokens map
    const tokens = userDoc.data()?.tokens;

    if (!tokens || Object.keys(tokens).length === 0) {
      throw new functions.https.HttpsError("not-found", "No tokens available");
    }

    // Prepare the payload
    const payload = {
      data: {
        title,
        message,
        body,
      },
    };

    // Send notifications to each token
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
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send push notification"
    );
  }
});
