import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Figtree', sans-serif`,
    body: `'Figtree', sans-serif`,
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false, // Forces light mode
  },
});

export function Provider({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
