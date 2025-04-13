// App.tsx

// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

// React and Hooks
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Mantine components and hooks
import { AppShell, Button, Loader, Center } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

// Authentication context and components
import { useAuth } from "./auth/AuthProvider";
import { requestNotificationPermission, initMessaging } from "@/firebaseConfig";

// App features and assets
import { AuthenticationForm } from "./features/auth/AuthenticationForm";
// import { SignOut } from "@/features/auth/SignOut";

// Components
import { NotifyButton } from "@/components/notifyButton";
import Rdp from "@/features/views/Rdp";

export function App() {
  // Hooks

  const { user, loading } = useAuth();
  // const theme = useMantineTheme();

  const [subscription, setSubscription] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);

  const [hasHeaderBar, setHasHeaderBar] = useState<boolean>(false);

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
    <AppShell style={{ backgroundColor: "white" }}>
      <Notifications position="top-left" zIndex={1984} />

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
              <Route
                path="/rdp"
                element={<Rdp onMonthChange={setCurrentMonth} />}
              />

              <Route path="*" element={<Navigate to="/rdp" />} />
            </>
          ) : (
            <Route path="*" element={<AuthenticationForm />} />
          )}
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
