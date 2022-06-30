/**
 * This endpoint should take some SQL to run, and some SQL to evaluate.
 * It will create a new database, create a new role in the database (with permissions only
 * to the newly created database), execute the run_sql, then evaluate each of the eval_sqls,
 * (collecting the output of each one to return), then destroy the role and the database.
 *
 * We use this to test SQL. The first eval_sql commands usually have CREATE
 * TABLEs and INSERTs, then the remaining eval_sql allows you to look at the
 * result of different queries.
 *
 * As a bonus, this endpoint also returns a pgtui JSON tree of the created database.
 */

import * as pg from "pg"
import pgStructure from "pg-structure"
import { parse as parseConnectionString } from "pg-connection-string"

export default async (req, res) => {
  const { eval_sql } = req.body as {
    eval_sql: string[]
  }

  const superclient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  })
  await superclient.connect()

  // invocation id
  const iid = Math.random().toString(32).slice(2, 14)
  const testDbName = `testdb_${iid}`
  const testRole = `testrole_${iid}`

  await superclient.query(
    `CREATE ROLE ${testRole} WITH LOGIN PASSWORD '${iid}';`
  )
  await superclient.query(`CREATE DATABASE ${testDbName} OWNER ${testRole};`)

  const superConnectionParams = parseConnectionString(process.env.DATABASE_URL)

  const sandboxedClientConnectionParams: any = {
    ...superConnectionParams,
    database: testDbName,
    user: testRole,
    password: iid,
  }

  const sandboxclient = new pg.Client(sandboxedClientConnectionParams)
  await sandboxclient.connect()

  const eval_results = []
  let has_error = false

  console.log(`Running eval_sql...`)
  try {
    for (const eval_sql_line of eval_sql) {
      eval_results.push(await sandboxclient.query(eval_sql_line))
    }
  } catch (e) {
    eval_results.push({
      error: e.toString(),
    })
    has_error = true
  }
  await sandboxclient.end()

  // This output is difficult to parse w/o deserializing, might not work in
  // browser
  // const dbStructure = JSON.parse(
  //   (
  //     await pgStructure(sandboxedClientConnectionParams, {
  //       includeSchemas: ["public"],
  //     })
  //   ).serialize()
  // )
  const dbStructure = {}

  await superclient.query(`DROP DATABASE ${testDbName};`)
  await superclient.query(`DROP OWNED BY ${testRole} CASCADE;`)
  await superclient.query(`DROP ROLE ${testRole};`)
  await superclient.end()

  res.status(200).json({ eval_results, has_error, db_structure: dbStructure })
}
