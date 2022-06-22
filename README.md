# RLS Tutorials

Interactive Postgres Row Level Security tutorials. [You can take them online here](#)

Row Level Security is a powerful technology for securing your application by
applying database-level policies on your data access. For example, you can
configure incoming API keys (or session tokens) to only be able to access
rows of each table that are connected to their account. `SELECT`, `INSERT` (etc)
queries will automatically filter or limit data based on your policies.

Row Level Security dramatically reduces the attack surface of your application
while simplifying your application code. Covering the surface of database interactions in tests is much easier than covering the surface of API
interactions.

## Usage

If you don't want to use the online version of this project, you can run it
locally like so:

```bash
export DATABASE_URL=postgresql://postgres@localhost:5432/postgres
yarn install
yarn start
```
