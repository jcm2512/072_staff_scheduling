import "@mantine/core/styles.css";

import { Schedule } from "@/features/schedule/Schedule";
import { AuthenticationForm } from "@/features/auth/authenticationForm";

import { useAuth } from "@/auth/AuthProvider";

export function MainLayout() {
  const { user } = useAuth();

  return <>{user ? <Schedule /> : <AuthenticationForm />}</>;
}
