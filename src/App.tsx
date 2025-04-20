// App.tsx
import logo from "@/assets/shiftori_logo.png";

// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

// React and Hooks
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Mantine components and hooks
import { Loader, Center } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

// Authentication context and components
import { useAuth } from "./auth/AuthProvider";
import {
  // requestNotificationPermission,
  initMessaging,
} from "@/firebaseConfig";

// App features and assets
import { AuthenticationForm } from "./features/auth/AuthenticationForm";
// import { SignOut } from "@/features/auth/SignOut";

// Components
import Header from "@/features/components/Header";
// import { NotifyButton } from "@/components/notifyButton";
import CalendarView from "@/features/views/CalendarView";

// Context
import { HeaderProvider } from "@/context/HeaderContext";

export function App() {
  const [headerHeight, setHeaderHeight] = useState<number>(60);
  const [currentMonthLabel, setCurrentMonthLabel] = useState("");
  const { user, loading } = useAuth();
  // const theme = useMantineTheme();

  // const [subscription, setSubscription] = useState<string | null>(null);

  // const handleRequestPermission = async () => {
  //   const token = await requestNotificationPermission();
  //   if (token) {
  //     setSubscription(token);
  //     console.log(subscription);
  //   }
  // };

  useEffect(() => {
    const setup = async () => {
      await initMessaging();
    };
    setup();
  }, []);

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" color="#4ECDC4" />
      </Center>
    );
  }

  return (
    <HeaderProvider>
      <Header
        {...{
          PADDING: "0.3rem",
          isMobile: false, // or detect this here if needed
          logo,
          CONTEXTUAL_TITLE: currentMonthLabel,
        }}
      />
      <Notifications position="top-left" zIndex={1984} />
      <Routes>
        {user ? (
          <>
            <Route
              path="/calendar"
              element={
                <CalendarView
                  headerHeight={headerHeight}
                  currentMonthLabel={currentMonthLabel}
                  setCurrentMonthLabel={setCurrentMonthLabel}
                />
              }
            />
            <Route path="*" element={<Navigate to="/calendar" />} />
          </>
        ) : (
          <Route path="*" element={<AuthenticationForm />} />
        )}
      </Routes>
    </HeaderProvider>
  );
}
