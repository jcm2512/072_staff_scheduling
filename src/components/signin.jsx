import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { signInWithGoogle, logOut } from "@/auth/authService";

function Signin({ setUser }) {
  const handleSignIn = async () => {
    const signedInUser = await signInWithGoogle();
    setUser(signedInUser);
  };

  return (
    <>
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          ELC Scheduling
        </Heading>

        <Button colorScheme="blue" size="lg" onClick={handleSignIn}>
          Sign in with Google
        </Button>
      </VStack>
    </>
  );
}

export default Signin;
