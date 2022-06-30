import { useEffect, useState } from "react"
import CodeEditor from "./CodeEditor"
import * as Chakra from "@chakra-ui/react"
import { useQuery } from "react-query"
import stripIndent from "strip-indent"
import axios from "axios"
import { useDebounce } from "use-debounce"

interface Props {
  schemaSQL: string
  prefixCode: string
  startingCode: string
  nextChallengeUrl: string
  tests: Array<{
    description: string
    sql: string
    test: Function
  }>
}

export const Challenge = (props: Props) => {
  const [userCode, setUserCode] = useState(stripIndent(props.startingCode))
  const userCodeDebounced = useDebounce(userCode, 500)
  const query = useQuery(["challenge1_sql", userCodeDebounced], async () => {
    const eval_sql = [props.schemaSQL, props.prefixCode, userCode].filter(
      Boolean
    )
    const user_code_index = eval_sql.length - 1
    const test_index_start = eval_sql.length
    eval_sql.push(...props.tests.map((t) => t.sql))
    const res = await axios.post("/api/database/run", { eval_sql })
    const { eval_results, has_error } = res.data
    const error_index = eval_results.findIndex((r) => r.error)
    const test_results = props.tests.map(
      (t, i) => eval_results[test_index_start + i]
    )
    return {
      ...res.data,
      eval_sql,
      error_index,
      test_index_start,
      user_code_result: eval_results[user_code_index],
      test_results,
      test_status: props.tests.map((t, i) => {
        try {
          return t.test(test_results[i])
        } catch (e) {
          console.log("error in test", e.toString())
          return false
        }
      }),
    }
  })
  return (
    <Chakra.Box>
      <Chakra.Tabs>
        <Chakra.TabList>
          <Chakra.Tab>Schema SQL</Chakra.Tab>
          {/* <Chakra.Tab>Schema</Chakra.Tab> */}
          <Chakra.Tab>Challenge Editor</Chakra.Tab>
        </Chakra.TabList>
        <Chakra.TabPanels>
          <Chakra.TabPanel>
            <CodeEditor readonly code={stripIndent(props.schemaSQL).trim()} />
          </Chakra.TabPanel>
          {/* <Chakra.TabPanel></Chakra.TabPanel> */}
          <Chakra.TabPanel>
            <CodeEditor
              prefixCode={props.prefixCode || ""}
              code={userCode}
              onChange={(userCode) => setUserCode(userCode)}
            />
            {query.data?.test_status?.every(Boolean) && (
              <Chakra.Flex pt={2}>
                <Chakra.Box flexGrow={1} />
                <Chakra.Button
                  onClick={() =>
                    (window.location.href = props.nextChallengeUrl)
                  }
                  colorScheme="green"
                >
                  Success! Next Challenge
                </Chakra.Button>
              </Chakra.Flex>
            )}
          </Chakra.TabPanel>
        </Chakra.TabPanels>
      </Chakra.Tabs>
      {query.data && query.data.has_error && (
        <Chakra.Alert status="error">
          <Chakra.AlertIcon />
          <Chakra.AlertTitle>SQL Error!</Chakra.AlertTitle>
          <Chakra.AlertDescription>
            <b>{query.data.eval_results[query.data.error_index].error}</b>
            <br />
            <Chakra.Text fontSize="sm">
              Caused by: {query.data.eval_sql[query.data.error_index]}
            </Chakra.Text>
          </Chakra.AlertDescription>
        </Chakra.Alert>
      )}
      <Chakra.Box>
        <Chakra.Accordion allowToggle allowMultiple>
          <Chakra.AccordionItem key="output">
            <Chakra.AccordionButton>
              {query.isLoading ? <Chakra.Spinner></Chakra.Spinner> : null}
              <Chakra.Text pl={4} sx={{ textAlign: "left" }} flexGrow={1}>
                Output
              </Chakra.Text>
              <Chakra.AccordionIcon />
            </Chakra.AccordionButton>
            <Chakra.AccordionPanel>
              <CodeEditor
                readonly
                language="js"
                key={query.data?.user_code_result}
                code={(() => {
                  try {
                    if (!query.data?.user_code_result?.map) {
                      return JSON.stringify(
                        query.data?.user_code_result?.rows,
                        null,
                        "  "
                      )
                    }
                    return JSON.stringify(
                      query.data?.user_code_result?.map((r) => r.rows),
                      null,
                      "  "
                    )
                  } catch (e) {
                    return e.toString()
                  }
                })()}
              />
            </Chakra.AccordionPanel>
          </Chakra.AccordionItem>
          {props.tests.map((t, i) => (
            <Chakra.AccordionItem key={i}>
              <Chakra.AccordionButton>
                <Chakra.Text
                  textAlign="left"
                  alignContent="flex-start"
                  flexGrow="1"
                  pb={2}
                >
                  <Chakra.Badge
                    colorScheme={query.data?.test_status?.[i] ? "green" : "red"}
                    mr={4}
                  >
                    Test {i + 1}
                  </Chakra.Badge>
                  {t.description}
                </Chakra.Text>
                <Chakra.AccordionIcon />
              </Chakra.AccordionButton>
              <Chakra.AccordionPanel>
                <CodeEditor readonly code={t.sql} />
                <Chakra.Text pt={2} pb={2}>
                  Result:
                </Chakra.Text>
                <CodeEditor
                  readonly
                  language="js"
                  key={query.data?.test_results?.[i]}
                  code={(() => {
                    try {
                      const result = query.data?.test_results?.[i]
                      if (!result) return ""
                      if (result.rows)
                        return JSON.stringify(result.rows, null, "  ")
                      return JSON.stringify(
                        result[result.length - 1].rows,
                        null,
                        "  "
                      )
                    } catch (e) {
                      return
                    }
                  })()}
                />
              </Chakra.AccordionPanel>
            </Chakra.AccordionItem>
          ))}
        </Chakra.Accordion>
      </Chakra.Box>
    </Chakra.Box>
  )
}
