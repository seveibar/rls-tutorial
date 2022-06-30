import { ChakraProvider } from "@chakra-ui/react"

export const MyApp = ({ Component, pageProps }: any) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
