import "@mantine/core/styles.css";

import { Button } from "@mantine/core";

import { logOut } from "@/auth/authService";

export function SignOut() {
  return (
    <Button
      onClick={async () => {
        console.log("Logging out...");
        await logOut();
        console.log("Logged out successfully");
      }}
      autoContrast
    >
      Sign Out
    </Button>
  );
}
