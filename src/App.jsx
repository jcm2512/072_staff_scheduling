import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { signInWithGoogle, logOut } from "./auth/authService";

function App() {
  const [user, setUser] = useState(null);

  const handleSignIn = async () => {
    const signedInUser = await signInWithGoogle();
    setUser(signedInUser);
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <Box
      bg="gray.100"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container
        maxW="container.md"
        textAlign="center"
        py={10}
        bg="white"
        boxShadow="md"
        borderRadius="md"
        p={8}
      >
        <VStack spacing={6}>
          <Heading as="h1" size="xl">
            Welcome to My Chakra UI Landing Page
          </Heading>
          <Text fontSize="lg" color="gray.600">
            This is a simple landing page built with Chakra UI and React.
          </Text>

          {user ? (
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
          ) : (
            <Button colorScheme="blue" size="lg" onClick={handleSignIn}>
              Sign in with Google
            </Button>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
