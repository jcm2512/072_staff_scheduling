import { useState } from "react";
import { Button, Heading, Text, VStack, Image } from "@chakra-ui/react";
import { signInWithGoogle, logOut } from "@/auth/authService";

function Home({ user, setUser }) {
  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <>
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          Welcome to My Chakra UI Landing Page
        </Heading>
        <Text fontSize="lg" color="gray.600">
          This is a simple landing page built with Chakra UI and React.
        </Text>

        <>
          <Image
            borderRadius="full"
            boxSize="80px"
            src={user.photoURL}
            alt="User Profile"
          />
          <Text fontSize="lg" fontWeight="bold">
            {user.displayName}
          </Text>
          <Button colorScheme="red" size="lg" onClick={handleLogout}>
            Logout
          </Button>
        </>
      </VStack>
    </>
  );
}

export default Home;
