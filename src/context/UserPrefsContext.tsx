import { createContext, useContext, useState } from "react";

type UserPrefsContextType = {
  newDaySchedule: boolean;
  setNewDaySchedule: (val: boolean) => void;
};

const UserPrefsContext = createContext<UserPrefsContextType | undefined>(
  undefined
);

export const UserPrefsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Hooks
  const [newDaySchedule, setNewDaySchedule] = useState<boolean>(true);

  return (
    <UserPrefsContext.Provider
      value={{
        newDaySchedule,
        setNewDaySchedule,
      }}
    >
      {children}
    </UserPrefsContext.Provider>
  );
};

export const useUserPrefsContext = () => {
  const context = useContext(UserPrefsContext);
  if (!context) {
    throw new Error(
      "useUserPrefsContext must be used within a UserPrefsProvider"
    );
  }
  return context;
};
