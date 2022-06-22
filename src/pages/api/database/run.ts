import * as pg from "pg"

export default async (req, res) => {
  const { run_sql, eval_sql } = req.body

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  })
  await client.connect()
}
