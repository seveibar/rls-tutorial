import test from "ava"
import fixture from "nextjs-ava-fixture"

test("should be able to run sql", async (t) => {
  const { axios } = await fixture(t)

  const { data } = await axios.post("/api/database/run", {
    eval_sql: [
      `CREATE TABLE people (id serial PRIMARY KEY, name text);`,
      `INSERT INTO people (name) VALUES ('@seveibar');`,
      `SELECT * FROM people;`,
    ],
  })

  console.log(data)
  t.truthy(data)
})
