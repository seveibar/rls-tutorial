import test from "ava"
import fixture from "nextjs-ava-fixture"

test("should be able to run sql", async (t) => {
  const { axios } = await fixture(t)

  const { data } = await axios.post("/api/database/run", {
    run_sql: `CREATE TABLE people (id serial PRIMARY KEY, name text);`,
    eval_sql: [`SELECT 1`],
  })

  console.log(data)
  t.truthy(data)
})
