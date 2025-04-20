// App.tsx

// Import styles of installed packages
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

// React and Hooks
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Mantine components and hooks
import { AppShell, Loader, Center } from "@mantine/core";
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
// import { NotifyButton } from "@/components/notifyButton";
import Rdp from "@/features/views/Rdp";
import Virtualized from "@/features/views/Virtualized";

export function App() {
  // Hooks

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
    <>
      {/* <AppShell style={{ backgroundColor: "white" }}> */}
      <Notifications position="top-left" zIndex={1984} />

      {/* <AppShell.Main
          style={{
            height: "100vh",
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        > */}
      <Routes>
        {user ? (
          <>
            <Route path="/calendar" element={<Virtualized />} />
            <Route path="*" element={<Navigate to="/calendar" />} />
          </>
        ) : (
          <Route path="*" element={<AuthenticationForm />} />
        )}
      </Routes>
      {/* </AppShell.Main> */}
      {/* </AppShell> */}
    </>
  );
}
