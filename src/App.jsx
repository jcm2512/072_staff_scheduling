// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Title,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./styles/MobileNavbar.module.css";

import Home from "./components/home";
import Signin from "./components/signin";
import UserAvatar from "./components/userAvatar";
import logo from "./assets/shiftori_logo.png";
import { AuthenticationForm } from "./components/authenticationForm";
function App() {
  const [user, setUser] = useState(null);
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group gap="xs">
              <img src={logo} alt="Shiftori" style={{ height: 40 }} />

              <Title order={1}>シフトリ</Title>
              <Title order={2}>
                <Text>SHIFTORI</Text>
              </Title>
            </Group>

            <Group ml="xl" gap={0} visibleFrom="sm">
              <UnstyledButton className={classes.control}>Home</UnstyledButton>
              <UnstyledButton className={classes.control}>Blog</UnstyledButton>
              <UnstyledButton className={classes.control}>
                Contacts
              </UnstyledButton>
              <UnstyledButton className={classes.control}>
                Support
              </UnstyledButton>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
        <UnstyledButton className={classes.control}>Blog</UnstyledButton>
        <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
        <UnstyledButton className={classes.control}>Support</UnstyledButton>
        {user ? <UserAvatar {...{ user, setUser }} /> : <></>}
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Full screen height
          backgroundColor: "hsla(180, 17%, 95%, 1)",
        }}
      >
        {user ? (
          <Home {...{ user, setUser }} />
        ) : (
          <AuthenticationForm {...{ setUser }} />
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
