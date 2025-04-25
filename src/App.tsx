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
import Menu from "@/features/components/Menu";

// import { NotifyButton } from "@/components/notifyButton";
import CalendarView from "@/features/views/CalendarView";
import { BlankView } from "@/features/views/BlankView";
import { DayView } from "@/features/views/DayView";

// Context
import { HeaderProvider } from "@/context/HeaderContext";
import { MenuProvider } from "@/context/MenuContext";
import { SelectedDayProvider } from "@/context/SelectedDayContext";
import { ScheduleProvider } from "@/context/ScheduleContext";
import { UserPrefsProvider } from "@/context/UserPrefsContext";

export function App() {
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
    <UserPrefsProvider>
      <HeaderProvider>
        <MenuProvider>
          <ScheduleProvider>
            <SelectedDayProvider>
              <Header
                {...{
                  PADDING: "0.3rem",
                  isMobile: false,
                  logo,
                  CONTEXTUAL_TITLE: currentMonthLabel,
                }}
              />
              <Notifications position="top-left" zIndex={1984} />
              <Routes>
                {user ? (
                  <>
                    <Route
                      path="/month"
                      element={
                        <>
                          <CalendarView
                            currentMonthLabel={currentMonthLabel}
                            setCurrentMonthLabel={setCurrentMonthLabel}
                          />
                        </>
                      }
                    />
                    <Route
                      path="/inbox"
                      element={<BlankView title="Inbox"></BlankView>}
                    ></Route>
                    <Route
                      path="/settings"
                      element={<BlankView title="Settings"></BlankView>}
                    ></Route>
                    <Route path="/day" element={<DayView></DayView>}></Route>
                    <Route path="*" element={<Navigate to="/month" />} />
                  </>
                ) : (
                  <Route path="*" element={<AuthenticationForm />} />
                )}
              </Routes>
              <Menu></Menu>
            </SelectedDayProvider>
          </ScheduleProvider>
        </MenuProvider>
      </HeaderProvider>
    </UserPrefsProvider>
  );
}
