// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import classes from "./styles/MobileNavbar.module.css";

// React and Hooks
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Mantine components and hooks
import {
  AppShell,
  Group,
  Title,
  Text,
  Burger,
  Button,
  useMantineTheme,
  UnstyledButton,
  Loader,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// Authentication context and components
import { useAuth } from "./auth/AuthProvider";
import {
  requestNotificationPermission,
  listenForMessages,
  initMessaging,
} from "@/firebaseConfig";

// App features and assets
import { AuthenticationForm } from "./features/auth/AuthenticationForm";
import { SignOut } from "@/features/auth/SignOut";
import { MonthView } from "@/features/views/ListView";
import { CalendarSwipeView } from "@/features/views/CalendarSwipeView";
import logo from "@/assets/shiftori_logo.png";

export function App() {
  // Hooks
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const { user, loading } = useAuth();
  // const { setMonthlySchedule, loading, error } = useSchedule();
  const theme = useMantineTheme();

  const navigate = useNavigate();

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" color="teal" />
      </Center>
    );
  }

  function EmptyPage() {
    return <div></div>;
  }

  // handle subcription token
  const [subscription, setSubscription] = useState<string | null>(null);

  const handleRequestPermission = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setSubscription(token);
    }
  };

  useEffect(() => {
    const setupFCM = async () => {
      const messaging = await initMessaging();
      if (messaging) {
        listenForMessages();
      }
    };

    setupFCM();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/calendar");
    }
  }, [user, navigate]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: "20vw",
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
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
          </Group>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar py="md" px={4}>
        {/* Navbar Menu */}
        <>
          {/* <SignOut /> */}
          {user && (
            <>
              <Button onClick={handleRequestPermission}>
                Enable Notifications
              </Button>
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {subscription}
              </pre>
            </>
          )}
        </>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          display: "flex",
          justifyContent: "center",
          // minHeight: "calc(var(--vh, 1vh) * 100)", // may not be needed as the AppShell defaults to this anyway
          backgroundColor: theme.colors.background[0],
        }}
      >
        <Routes>
          {user ? (
            <>
              <Route path="/calendar" element={<CalendarSwipeView />} />
              <Route path="/shifts" element={<EmptyPage />} />
              <Route path="*" element={<Navigate to="/calendar" />} />
            </>
          ) : (
            <Route path="*" element={<AuthenticationForm />} />
          )}
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
