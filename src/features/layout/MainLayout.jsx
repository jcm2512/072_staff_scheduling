import { AuthenticationForm } from "@/features/auth/authenticationForm";

import { useAuth } from "@/auth/AuthProvider";

import { MonthView } from "@/features/views/MonthView";
export function MainLayout() {
  const { user } = useAuth();

  return <>{user ? <MonthView /> : <AuthenticationForm />}</>;
}
