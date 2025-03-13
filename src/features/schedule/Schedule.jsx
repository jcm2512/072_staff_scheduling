import { useAuth } from "@/auth/AuthProvider";

import { Group } from "@mantine/core";

export function Schedule() {
  const { user } = useAuth();
  return <Group>Welcome {user.displayName || "User"} </Group>;
}
