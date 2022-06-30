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
        Postgres RLS Challenge 3: RLS for an API
      </Chakra.Heading>
      <Chakra.Text fontSize="sm" mt={4}>
        Here we have an API for accessing houses. When authenticating with an
        API Key, you can view workspace settings or look at houses in your API
        Key's workspace, but nothing else.
        <br />
        <br />
        When you're authenticating with a website_session_token, you can access
        your account information, update the workspace settings and see any
        house connected to any workspace you belong to.
      </Chakra.Text>
      <Chakra.Box pt={2} pb={20}>
        <Challenge
          nextChallengeUrl="/challenge-3"
          prefixCode={""}
          startingCode={""}
          schemaSQL={`
            CREATE TABLE workspace (
              workspace_id integer PRIMARY KEY,
              some_workspace_setting text
            );

            CREATE TABLE house (
              house_id integer PRIMARY KEY,
              address text,
              workspace_id integer NOT NULL references workspace
            );

            CREATE TABLE api_key (
              api_key_id integer PRIMARY KEY,
              token text NOT NULL,
              workspace_id integer NOT NULL references workspace
            );

            CREATE TABLE account (
              account_id text PRIMARY KEY,
              email text NOT NULL
            );

            CREATE TABLE website_session_token (
              website_session_token_id integer PRIMARY KEY,
              account_id text NOT NULL references account,
              token text NOT NULL
            );

            CREATE TABLE workspace_account (
              account_id text NOT NULL references account,
              workspace_id integer NOT NULL references workspace
            );

            INSERT INTO workspace (workspace_id, some_workspace_setting) VALUES
              ('1', 'enabled'),
              ('2', 'enabled');

            INSERT INTO account (account_id, email) VALUES
              ('john', 'john@example.com'),
              ('bianca', 'bianca@example.com');
            
            INSERT INTO workspace_account (account_id, workspace_id) VALUES
              ('john', '1'),
              ('bianca', '2');

            INSERT INTO house (house_id, address, workspace_id) VALUES
              ('1', '123 Amy Lane', '1'),
              ('2', '300 Main Street', '1'),
              ('3', 'Somewhere in Ohio', '2');
            
            INSERT INTO api_key (api_key_id, token, workspace_id) VALUES
              ('1', 'KEY_FOR_WS1', '1'),
              ('2', 'KEY_FOR_WS2', '2');
            
            INSERT INTO website_session_token (website_session_token_id, account_id, token) VALUES
              ('1', 'john', 'JOHN_SESSION_TOKEN'),
              ('2', 'bianca', 'BIANCA_SESSION_TOKEN');

            ALTER TABLE house ENABLE ROW LEVEL SECURITY;
            ALTER TABLE house FORCE ROW LEVEL SECURITY;
            ALTER TABLE workspace ENABLE ROW LEVEL SECURITY;
            ALTER TABLE workspace FORCE ROW LEVEL SECURITY;
            ALTER TABLE api_key ENABLE ROW LEVEL SECURITY;
            ALTER TABLE api_key FORCE ROW LEVEL SECURITY;
            ALTER TABLE website_session_token ENABLE ROW LEVEL SECURITY;
            ALTER TABLE website_session_token FORCE ROW LEVEL SECURITY;
            ALTER TABLE account ENABLE ROW LEVEL SECURITY;
            ALTER TABLE account FORCE ROW LEVEL SECURITY;
            ALTER TABLE account_workspace ENABLE ROW LEVEL SECURITY;
            ALTER TABLE account_workspace FORCE ROW LEVEL SECURITY;
            `}
          tests={[
            {
              description:
                "KEY_FOR_WS1 should be able to access houses in workspace 1",
              sql: "SELECT set_config('app.api_key', 'KEY_FOR_WS1', false);\nSELECT * FROM house;",
              test: (result) => {
                return result[1].rows.length === 2
              },
            },
          ]}
        />
      </Chakra.Box>
    </Chakra.Container>
  )
}
