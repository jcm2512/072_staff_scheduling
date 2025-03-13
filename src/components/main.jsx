import "@mantine/core/styles.css";

import { AppShell, useMantineTheme } from "@mantine/core";

import Home from "@/components/home";
import { AuthenticationForm } from "@/components/authenticationForm";

export function Main(user, setUser) {
  return (
    <>
      {user ? (
        <Home {...{ user, setUser }} />
      ) : (
        <AuthenticationForm {...{ setUser }} />
      )}
    </>
  );
}
