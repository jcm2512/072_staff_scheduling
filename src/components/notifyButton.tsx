import React from "react";
import { getUserTokens, sendNotification } from "@/utils/sendNotification";

type Props = {
  companyId: string;
  userId: string;
  title?: string;
  // message?: string;
  body?: string;
};

export const NotifyButton: React.FC<Props> = ({
  companyId,
  userId,
  title = "Shift Change",
  // message = "You have a new shift change",
  body = "You have a new shift change",
}) => {
  const handleClick = async () => {
    try {
      const tokens = await getUserTokens(companyId, userId); // string[]
      console.log("Tokens:", tokens);

      if (tokens.length === 0) {
        console.warn("No tokens found for user.");
        return;
      }

      const result = await sendNotification(tokens, title, body);
      console.log("Notification sent:", result);
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  };

  return <button onClick={handleClick}>Send Notification</button>;
};
