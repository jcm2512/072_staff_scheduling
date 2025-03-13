// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useState } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AuthProvider } from "./auth/AuthProvider";
import { Header } from "./features/layout/Header";
import { NavItems } from "./features/navigation/NavItems";
import { MainLayout } from "./features/layout/MainLayout";

export function App() {
  const [opened, { toggle }] = useDisclosure();

  const theme = useMantineTheme();

  const styles = {
    main: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: theme.colors.background[0],
    },
    navbar: {
      width: 300,
      breakpoint: "sm",
      collapsed: { desktop: true, mobile: !opened },
    },
  };

  return (
    <AuthProvider>
      <AppShell header={{ height: 60 }} navbar={styles.navbar} padding="md">
        <Header {...{ opened, toggle }}></Header>
        <AppShell.Navbar py="md" px={4}>
          <NavItems />
        </AppShell.Navbar>
        <AppShell.Main style={styles.main}>
          <MainLayout />
        </AppShell.Main>
      </AppShell>
    </AuthProvider>
  );
}
