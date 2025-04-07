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
  Box,
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

type HeaderBarProps = {
  titleEn: string;
  titleJp: string;
  info: string;
  mobileOpened: boolean;
  toggleMobile: () => void;
};

export function HeaderBar({
  titleEn = "SHIFTORI",
  titleJp = "シフトリ",
  info,
  mobileOpened,
  toggleMobile,
}: HeaderBarProps) {
  return (
    <Group h="100%" px="md" style={{ position: "relative" }}>
      {/* Left fixed section */}
      <Box style={{ width: 60, display: "flex", alignItems: "center", gap: 8 }}>
        <Group gap="xs">
          <img
            src={logo}
            alt="Shiftori"
            style={{
              height: 40,
            }}
          />

          <Title order={1}>{titleJp}</Title>
          <Title order={2}>
            <Text>{titleEn}</Text>
          </Title>
        </Group>
      </Box>

      {/* Centered info */}
      <Box
        style={{
          position: "absolute",
          left: 60,
          right: 40,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Title order={1} style={{ margin: 0, lineHeight: 1 }}>
          <Text>{info}</Text>
        </Title>
      </Box>

      {/* Right burger */}
      <Burger
        opened={mobileOpened}
        onClick={toggleMobile}
        hiddenFrom="sm"
        size="sm"
        style={{ marginLeft: "auto" }}
      />
    </Group>
  );
}

export function App() {
  // Hooks
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);

  const { user, loading } = useAuth();
  const theme = useMantineTheme();

  const [subscription, setSubscription] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);

  const CalendarScrollViewProps = {
    isMobile,
    onMonthChange: (date: Date) => {
      setCurrentMonth(date); // sets current date to month in scroll view
    },
  };

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
      style={{ backgroundColor: "white" }}
    >
      <Notifications position="top-left" zIndex={1984} />
      <AppShell.Header
        style={{
          backgroundColor: "#F3F6F6",
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          {/* Left: Logo and Titles */}
          <Group gap="xs" w={isMobile ? 60 : 300}>
            <img src={logo} alt="Shiftori" style={{ height: 40 }} />
            {!isMobile && (
              <>
                <Title order={1}>シフトリ</Title>
                <Title order={2}>
                  <Text>SHIFTORI</Text>
                </Title>
              </>
            )}
          </Group>

          {/* Center: Current Month */}
          <Box style={{ flex: 1, textAlign: "center" }}>
            <Title order={1} size={"1.5em"}>
              {currentMonth
                ? currentMonth.toLocaleString("en", {
                    month: "long",
                    ...(currentMonth.getFullYear() !==
                      new Date().getFullYear() && {
                      year: "numeric",
                    }),
                  })
                : ""}
            </Title>
          </Box>

          {/* Right: Burger Menu */}
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
          // backgroundColor: theme.colors.background[0],
        }}
      >
        <Routes>
          {user ? (
            <>
              <Route path="/calendar-old" element={<CalendarSwipeView />} />
              <Route
                path="/calendar"
                element={<CalendarScrollView {...CalendarScrollViewProps} />}
              />
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
