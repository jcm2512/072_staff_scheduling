import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

function App() {
  const [count, setCount] = useState(0);

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
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => setCount(count + 1)}
          >
            Clicked {count} times
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
