import { useState } from "react"
import * as Chakra from "@chakra-ui/react"

export default () => {
  return (
    <Chakra.Container pt={8}>
      <Chakra.Heading size="lg">
        Postgres Row Level Security Tutorials
      </Chakra.Heading>
      <Chakra.Text fontSize="sm" mt={4}>
        Row Level Security is a powerful technology for securing your
        application by applying database-level policies on your data access. For
        example, you can configure incoming API keys (or session tokens) to only
        be able to access rows of each table that are connected to their
        account. `SELECT`, `INSERT` (etc) queries will automatically filter or
        limit data based on your policies.
      </Chakra.Text>
      <Chakra.Text fontSize="sm" mt={4}>
        Row Level Security dramatically reduces the attack surface of your
        application while simplifying your application code. Covering the
        surface of database interactions in tests is much easier than covering
        the surface of API interactions.
      </Chakra.Text>
      <Chakra.Flex direction={"column"} pt={4}>
        <Chakra.Link sx={{ color: "blue" }} href="/challenge-1">
          Challenge 1: The Basics
        </Chakra.Link>
        <Chakra.Link sx={{ color: "blue" }} href="/challenge-2">
          Challenge 2: Complex Policies
        </Chakra.Link>
        <Chakra.Link sx={{ color: "blue" }} href="/challenge-1">
          Challenge 3: RLS for an API
        </Chakra.Link>
      </Chakra.Flex>
    </Chakra.Container>
  )
}
