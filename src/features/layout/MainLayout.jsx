import { AuthenticationForm } from "@/features/auth/authenticationForm";

import { useAuth } from "@/auth/AuthProvider";

import { CalendarView } from "@/features/views/CalendarView";
export function MainLayout() {
  const { user } = useAuth();

  return <>{user ? <CalendarView /> : <AuthenticationForm />}</>;
}
