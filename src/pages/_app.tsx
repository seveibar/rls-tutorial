import { ChakraProvider } from "@chakra-ui/react"

export const MyApp = ({ Component, pageProps }: any) => {
  return <Component {...pageProps} />
}

export default MyApp
