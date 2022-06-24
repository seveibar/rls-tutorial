/**
 * This endpoint should take some SQL to run, and some SQL to evaluate.
 * It will create a new database, create a new role in the database (with permissions only
 * to the newly created database), execute the run_sql, then evaluate each of the eval_sqls,
 * (collecting the output of each one to return), then destroy the role and the database.
 *
 * We use this to test SQL. The run_sql is filled with CREATE TABLE and INSERTs, then the
 * eval_sql allows you to look at the result of different queries.
 *
 * As a bonus, this endpoint also returns a pgtui JSON tree of the created database.
 */

import * as pg from "pg"

export default async (req, res) => {
  const { run_sql, eval_sql } = req.body as { run_sql: string, eval_sql: string[] }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  })
  await client.connect()
}
