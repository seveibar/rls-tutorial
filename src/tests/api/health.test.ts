import test from "ava"
import fixture from "nextjs-ava-fixture"

test("test /api/health", async (t) => {
  const { axios } = await fixture(t)

  const { data } = await axios.get("/api/health")

  t.truthy(data.ok)
})
