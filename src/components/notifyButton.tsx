import React from "react";
import { sendNotification } from "@/utils/sendNotification";

type Props = {
  companyId: string;
  userId: string;
  title?: string;
  message?: string;
  body?: string;
};

export const NotifyButton: React.FC<Props> = ({
  companyId,
  userId,
  title = "Shift Reminder",
  message = "Check your shift schedule",
  body = "Message body",
}) => {
  const handleClick = async () => {
    try {
      const result = await sendNotification({
        companyId,
        userId,
        title,
        message,
        body,
      });
      console.log("Notification sent:", result);
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  };

  return <button onClick={handleClick}>Send Notification</button>;
};
