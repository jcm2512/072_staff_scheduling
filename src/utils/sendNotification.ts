import { getFunctions, httpsCallable } from "firebase/functions";

export type SendNotificationParams = {
  companyId: string;
  userId: string;
  title: string;
  message: string;
  body: string;
};

export const sendNotification = async ({
  companyId,
  userId,
  title,
  message,
  body,
}: SendNotificationParams) => {
  const functions = getFunctions();
  const call = httpsCallable(functions, "sendPushToUser");

  const result = await call({ companyId, userId, title, message, body });
  return result.data;
};
