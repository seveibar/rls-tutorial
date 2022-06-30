import CodeEditor from "./CodeEditor"
import * as Chakra from "@chakra-ui/react"
import { useQuery } from "react-query"

interface Props {
  setupSQL: string
}

export const Challenge = (props: Props) => {
  return (
    <Chakra.Box>
      <Chakra.Tabs>
        <Chakra.TabList>
          <Chakra.Tab>Schema SQL</Chakra.Tab>
          <Chakra.Tab>Schema</Chakra.Tab>
          <Chakra.Tab>Editor</Chakra.Tab>
          <Chakra.Tab>Tests</Chakra.Tab>
        </Chakra.TabList>
        <Chakra.TabPanels>
          <Chakra.TabPanel></Chakra.TabPanel>
          <Chakra.TabPanel></Chakra.TabPanel>
        </Chakra.TabPanels>
      </Chakra.Tabs>
    </Chakra.Box>
  )
}
