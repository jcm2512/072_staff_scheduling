import { useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import Home from "./components/home";
import Signin from "./components/signin";

function App() {
  const [user, setUser] = useState(null);

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
        {user ? <Home {...{ user, setUser }} /> : <Signin {...{ setUser }} />}
      </Container>
    </Box>
  );
}

export default App;
