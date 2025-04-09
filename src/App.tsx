import logo from "@/assets/shiftori_logo.png";

// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

// React and Hooks
import { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
  Stack,
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
import { ColorCarouselPage } from "@/features/views/colorCarouselPage";

// Components
import { NotifyButton } from "@/components/notifyButton";
import Rdp from "@/features/views/Rdp";

export function App() {
  // Hooks
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);
  const isCompact = useMediaQuery(`(max-width: ${em(500)})`);

  const emblaRef =
    useRef<
      ReturnType<
        typeof import("@mantine/carousel").Carousel["prototype"]["getEmbla"]
      >
    >(null);

  const { user, loading } = useAuth();
  // const theme = useMantineTheme();

  const [subscription, setSubscription] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);

  const CalendarScrollViewProps = {
    isMobile,
    onMonthChange: (date: Date) => {
      setCurrentMonth(date); // sets current date to month in scroll view
    },
    emblaRef,
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
        style={
          {
            // backgroundColor: "#F3F6F6",
          }
        }
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
          <Box
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isCompact && (
              <Button
                variant="transparent"
                size="compact-xs"
                onClick={() => emblaRef.current?.scrollPrev()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                  />
                </svg>
              </Button>
            )}
            <Stack align="center" gap="0">
              <Title order={4} style={{ width: "6em", textAlign: "center" }}>
                {currentMonth
                  ? currentMonth.toLocaleString("en", { month: "long" })
                  : ""}
              </Title>
              {currentMonth &&
                currentMonth.getFullYear() !== new Date().getFullYear() && (
                  <Title
                    order={1}
                    size="1em"
                    style={{ width: "6em", textAlign: "center" }}
                  >
                    {currentMonth.toLocaleString("en", { year: "numeric" })}
                  </Title>
                )}
            </Stack>
            {!isCompact && (
              <Button
                variant="transparent"
                size="compact-xs"
                onClick={() => emblaRef.current?.scrollNext()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                  />
                </svg>
              </Button>
            )}
          </Box>

          {/* Right: Burger Menu */}
          <Group w={60} justify="flex-end">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
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
              <Route path="/colors" element={<ColorCarouselPage />} />
              <Route path="/rdp" element={<Rdp />} />

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
