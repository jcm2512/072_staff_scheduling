import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export type TokenMeta = {
  userAgent: string;
  createdAt: string;
};

export const getUserTokens = async (companyId: string, userId: string) => {
  const db = getFirestore();
  const userRef = doc(db, "companies", companyId, "users", userId);
  const userSnap = await getDoc(userRef);

  const data = userSnap.data();
  return data?.tokens || {};
};

export const sendNotification = async (
  tokens: Record<string, TokenMeta>,
  title: string,
  body: string,
) => {
  const functions = getFunctions();
  const call = httpsCallable(functions, "sendPushToUser");

  const result = await call({ tokens, title, body });
  return result.data;
};
