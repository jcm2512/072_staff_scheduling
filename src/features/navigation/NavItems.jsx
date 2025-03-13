import "@mantine/core/styles.css";

import { UnstyledButton } from "@mantine/core";
import classes from "@/styles/MobileNavbar.module.css";
import { SignOut } from "@/features/auth/SignOut";

export function NavItems() {
  return (
    <>
      <UnstyledButton className={classes.control}>NavItem</UnstyledButton>
      <SignOut />
    </>
  );
}
