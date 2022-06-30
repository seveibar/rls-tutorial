import * as Chakra from "@chakra-ui/react"
import { Challenge } from "../lib/components/Challenge"

/*

Solution:


CREATE POLICY friends_policy ON friends
  USING (
    name1 = current_setting('app.user') OR
    name2 = current_setting('app.user')
  );
CREATE POLICY transactions_policy ON transactions
  USING (
    from_user = current_setting('app.user') OR
    to_user = current_setting('app.user') OR
    (
      SELECT EXISTS(
        SELECT 1 FROM friends WHERE
          friends.name1 = from_user OR
          friends.name2 = to_user OR
          friends.name1 = to_user OR
          friends.name2 = from_user
      )
    )
  );

*/

export default () => {
  return (
    <Chakra.Container pt={8}>
      <Chakra.Heading size="lg">
        Postgres RLS Challenge 2: Complex Policies
      </Chakra.Heading>
      <Chakra.Text fontSize="sm" mt={4}>
        Row Level Security policies can have complex joining operations. Here we
        are going to allow friends to see each other's transactions.
        <br />
        <br />
        Consider John, he is friends with Karl, so he should be able to see the
        transaction between Karl and Craig.
        <br />
        <br />
        Hint: Policies must be a single expression, but they can call functions
        and have embedded subqueries!
        <br />
        Hint: By default, you can't access a table with RLS applied!
      </Chakra.Text>
      <Chakra.Box pt={2} pb={20}>
        <Challenge
          nextChallengeUrl="/challenge-3"
          prefixCode={""}
          startingCode={`
          CREATE POLICY transactions_policy ON transactions
          USING (
            from_user = current_setting('app.user') OR
            to_user = current_setting('app.user')
          );`}
          schemaSQL={`
            CREATE TABLE transactions (from_user text, to_user text, amount numeric);

            INSERT INTO transactions (from_user, to_user, amount) VALUES
              ('sarah', 'john', 20),
              ('john', 'jessica', 50),
              ('sarah', 'jessica', 30),
              ('karl', 'craig', 25);
            
            CREATE TABLE friends (name1 text, name2 text);

            INSERT INTO friends (name1, name2) VALUES
              ('sarah', 'jessica'),
              ('karl', 'john');

            ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
            ALTER TABLE transactions FORCE ROW LEVEL SECURITY;

            ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
            ALTER TABLE friends FORCE ROW LEVEL SECURITY;
            `}
          tests={[
            {
              description: "John should only be able to access 3 rows",
              sql: "SELECT set_config('app.user', 'john', false);\nSELECT * FROM transactions;",
              test: (result) => {
                return result[1].rows.length === 3
              },
            },
            {
              description: "Sarah should only be able to access 3 rows",
              sql: "SELECT set_config('app.user', 'sarah', false);\nSELECT * FROM transactions;",
              test: (result) => {
                return result[1].rows.length === 3
              },
            },
            {
              description: "John should only see his friends",
              sql: "SELECT set_config('app.user', 'john', false);\nSELECT * FROM friends;",
              test: (result) => {
                return (
                  result[1].rows.length === 1 &&
                  Object.values(result[1].rows[0]).includes("john")
                )
              },
            },
          ]}
        />
      </Chakra.Box>
    </Chakra.Container>
  )
}
