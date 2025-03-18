// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

// Component styles
import classes from "./styles/MobileNavbar.module.css";

// Mantine components and hooks
import {
  AppShell,
  Group,
  Title,
  Text,
  Burger,
  useMantineTheme,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// Authentication context and components
import { useAuth } from "./auth/AuthProvider";
import { AuthProvider } from "./auth/AuthProvider";

// App features and assets
import { AuthenticationForm } from "./features/auth/AuthenticationForm";
import { SignOut } from "@/features/auth/SignOut";
import { CalendarView } from "@/features/views/CalendarView";
import { CalendarSwipeView } from "@/features/views/CalendarSwipeView";
// import { CalendarScrollView } from "@/features/views/CalendarScrollView";
import logo from "@/assets/shiftori_logo.png";

// Components
const NavItems = () => {
  return (
    <>
      <UnstyledButton className={classes.control}>NavItem</UnstyledButton>
      <SignOut />
    </>
  );
};

export function App() {
  const [opened, { toggle }] = useDisclosure();
  const { user } = useAuth();

  const theme = useMantineTheme();

  return (
    <AuthProvider>
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
            <Group
              justify="space-between"
              style={{
                flex: 1,
              }}
            >
              <Group gap="xs">
                <img
                  src={logo}
                  alt="Shiftori"
                  style={{
                    height: 40,
                  }}
                />

                <Title order={1}>シフトリ</Title>
                <Title order={2}>
                  <Text>SHIFTORI</Text>
                </Title>
              </Group>

              <Group ml="xl" gap={0} visibleFrom="sm">
                <NavItems />
              </Group>
            </Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar py="md" px={4}>
          <NavItems />
        </AppShell.Navbar>
        <AppShell.Main
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: theme.colors.background[0],
          }}
        >
          {user ? <CalendarSwipeView /> : <AuthenticationForm />}
        </AppShell.Main>
      </AppShell>
    </AuthProvider>
  );
}
