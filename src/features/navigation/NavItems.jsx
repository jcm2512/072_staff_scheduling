import "@mantine/core/styles.css";

import { UnstyledButton } from "@mantine/core";
import classes from "@/styles/MobileNavbar.module.css";
import { SignOut } from "@/features/auth/SignOut";

import { useAuth } from "@/auth/AuthProvider";

export function NavItems() {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <>
          <UnstyledButton className={classes.control}>NavItem</UnstyledButton>
          <SignOut />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
