import { useState } from "react";
import { signInWithGoogle, logOut } from "@/auth/authService";
import { Group } from "@mantine/core";

function Home({ user, setUser }) {
  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return <Group>Logged in</Group>;
}

export default Home;
