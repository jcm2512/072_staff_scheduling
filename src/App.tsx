import logo from "@/assets/shiftori_logo.png";

// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

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
  Loader,
  Center,
  em,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

// Authentication context and components
import { useAuth } from "./auth/AuthProvider";
import { requestNotificationPermission, initMessaging } from "@/firebaseConfig";

// App features and assets
import { AuthenticationForm } from "./features/auth/AuthenticationForm";
// import { SignOut } from "@/features/auth/SignOut";

import { CalendarSwipeView } from "@/features/views/CalendarSwipeView";
import { CalendarScrollView } from "@/features/views/CalendarScrollView";
import ColorCarouselPage from "@/features/views/colorCarouselPage";
// Components
import { NotifyButton } from "@/components/notifyButton";

export function App() {
  // Hooks
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);

  const { user, loading } = useAuth();
  const theme = useMantineTheme();

  const navigate = useNavigate();

  // handle subcription token
  const [subscription, setSubscription] = useState<string | null>(null);

  const handleRequestPermission = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setSubscription(token);
      console.log(subscription);
    }
  };

  useEffect(() => {
    const setup = async () => {
      await initMessaging();
    };
    setup();
  }, []);

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" color="teal" />
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
    >
      <Notifications position="top-left" zIndex={1984} />
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
              <Button onClick={handleRequestPermission}>Enable Popups</Button>
              <NotifyButton
                companyId="companyId02"
                userId="agG3crgplFQ8auLjfiT4U7MxPJz2"
                title="Haruka"
                body="Hey could you please work on 5/7?"
              />
            </>
          )}
        </>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          backgroundColor: theme.colors.background[0],
        }}
      >
        <Routes>
          {user ? (
            <>
              {/* <Route path="/calendar" element={<CalendarSwipeView />} /> */}
              <Route
                path="/scroll"
                element={<CalendarScrollView {...{ isMobile }} />}
              />
              <Route path="/colors" element={<ColorCarouselPage />} />
              <Route path="*" element={<Navigate to="/scroll" />} />
            </>
          ) : (
            <Route path="*" element={<AuthenticationForm />} />
          )}
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
