import { useState } from "react";
import { Button, Heading, Text, VStack, Image } from "@chakra-ui/react";
import { signInWithGoogle, logOut } from "@/auth/authService";

function Home({ user, setUser }) {
  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <VStack spacing={6} justifyContent="center" alignItems="center"></VStack>
  );
}

export default Home;
