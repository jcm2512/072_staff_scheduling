// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useState } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "./components/header";
import { NavItems } from "./components/NavItems";
import { Main } from "./components/main";

function App() {
  const [user, setUser] = useState(null);
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
    <AppShell header={{ height: 60 }} navbar={styles.navbar} padding="md">
      <Header {...{ opened, toggle }}></Header>
      <AppShell.Navbar py="md" px={4}>
        <NavItems />
      </AppShell.Navbar>
      <AppShell.Main style={styles.main}>
        <Main {...{ user, setUser }} />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
