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
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./styles/MobileNavbar.module.css";

import Home from "./components/home";
import Signin from "./components/signin";
import UserAvatar from "./components/userAvatar";
import logo from "./assets/shiftori_logo.png";
import { AuthenticationForm } from "./components/authenticationForm";
import { AvatarPopover } from "./components/popover";
function App() {
  const [user, setUser] = useState(null);
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

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
              <AvatarPopover color="primary" />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
        <UnstyledButton className={classes.control}>Blog</UnstyledButton>
        <AvatarPopover color="primary" />
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Full screen height
          // backgroundColor: "hsla(180, 17%, 95%, 1)",
          // backgroundColor:
          //   theme.colors[
          //     theme.colorScheme === "dark" ? "pink" : "anti-flash-white"
          //   ][0],
          backgroundColor: theme.colors.background[0],
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
