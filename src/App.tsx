// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import classes from "./styles/MobileNavbar.module.css";

// React and Hooks
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSchedule } from "@/hooks/schedule";

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
import { showNotification } from "@mantine/notifications";

// Authentication context and components
import { useAuth } from "./auth/AuthProvider";

// App features and assets
import { AuthenticationForm } from "./features/auth/AuthenticationForm";
import { SignOut } from "@/features/auth/SignOut";
import { MonthView } from "@/features/views/ListView";
import { CalendarSwipeView } from "@/features/views/CalendarSwipeView";
import logo from "@/assets/shiftori_logo.png";

import { scheduleData } from "@/data/scheduleData";
import { subscribeUser, triggerPush } from "@/pushService";

export function App() {
  // Hooks
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const { user } = useAuth();
  const { setMonthlySchedule, loading, error } = useSchedule();
  const theme = useMantineTheme();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/calendar");
    }
  }, [user, navigate]);

  async function handleSaveSchedule() {
    await setMonthlySchedule(
      "companyId02",
      "teacherId016",
      "2025-03",
      scheduleData
    );
  }

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
          <UnstyledButton
            className={classes.control}
            onClick={async () => {
              const permission = await Notification.requestPermission();
              console.log("Notification Permission:", permission);
              if (permission === "granted") {
                await subscribeUser(user?.uid || "test-user");
                showNotification({
                  title: "Notifications Enabled",
                  message: "You'll now receive shift updates.",
                  color: "teal",
                });
              } else {
                showNotification({
                  title: "Notifications Blocked",
                  message: "You can enable them later in Settings.",
                  color: "red",
                });
              }
            }}
          >
            Enable Notifications
          </UnstyledButton>

          <UnstyledButton
            className={classes.control}
            onClick={() =>
              triggerPush(
                user?.uid || "test-user",
                "Manual Shift Update",
                "Here's your shift update!"
              )
            }
          >
            Test Push Notification (via GitHub Actions)
          </UnstyledButton>

          <div>
            <p>App ID from config: {import.meta.env.VITE_FIREBASE_APP_ID}</p>
          </div>

          <SignOut />
          {loading && <p>Saving…</p>}
          {error && <p>Error: {error.message}</p>}
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
              <Route path="/shifts" element={<MonthView />} />
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
