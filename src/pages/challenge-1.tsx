import { useState } from "react"
import * as Chakra from "@chakra-ui/react"
import CodeEditor from "../lib/components/CodeEditor"
import { Challenge } from "../lib/components/Challenge"

export default () => {
  return (
    <Chakra.Container pt={8}>
      <Chakra.Heading size="lg">
        Postgres RLS Challenge 1: The Basics
      </Chakra.Heading>
      <Chakra.Text fontSize="sm" mt={4}>
        Take a look at the schema below. Our database has two roles, superadmin
        and john. We want to make sure that the john can only access rows of the
        transactions table where he was one of the parties involved in the
        transaction.
      </Chakra.Text>
      <Chakra.Box pt={2}>
        <Challenge />
      </Chakra.Box>
    </Chakra.Container>
  )
}
