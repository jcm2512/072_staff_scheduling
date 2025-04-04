import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getUserTokens = async (
  companyId: string,
  userId: string
): Promise<string[]> => {
  const db = getFirestore();
  const userRef = doc(db, "companies", companyId, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return [];

  const data = userSnap.data();
  return Object.keys(data?.tokens || {});
};

export const sendNotification = async (
  tokens: string[],
  title: string,
  // message: string,
  body: string
) => {
  const functions = getFunctions();
  const call = httpsCallable(functions, "sendPushToUser");

  const result = await call({ tokens, title, body });
  return result.data;
};
