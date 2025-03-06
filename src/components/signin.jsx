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
import GoogleSignInButton from "./googleSignInButton";

function Signin({ setUser }) {
  const handleSignIn = async () => {
    const signedInUser = await signInWithGoogle();
    setUser(signedInUser);
  };

  return (
    <>
      <GoogleSignInButton setUser={setUser} />
    </>
  );
}

export default Signin;
