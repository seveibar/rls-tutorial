import { useState } from "react"
import * as Chakra from "@chakra-ui/react"
import CodeEditor from "../lib/components/CodeEditor"
import { Challenge } from "../lib/components/Challenge"
import stripIndent from "strip-indent"

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
        <Challenge
          prefixCode={"SELECT set_config('app.user', 'john', false)\n"}
          schemaSQL={`
            CREATE TABLE transactions (from_user text, to_user text, amount numeric);

            INSERT INTO transactions (from_user, to_user, amount) VALUES
              ('sarah', 'john', 20),
              ('john', 'jessica', 50),
              ('sarah', 'jessica', 30),
              ('karl', 'craig', 25);
            `}
          tests={[
            {
              description:
                "Should be able to get the current user of the session",
              sql: "SELECT current_setting('app.user') as current_user;",
              test: (result) => {
                console.log({ result })
                return result.rows.length === 1
              },
            },
          ]}
        />
      </Chakra.Box>
    </Chakra.Container>
  )
}
