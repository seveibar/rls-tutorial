import { useState } from "react"
import dynamic from "next/dynamic"
import "@uiw/react-textarea-code-editor/dist.css"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
)

export default () => {
  const [code, setCode] = useState("")

  return (
    <CodeEditor
      value={code}
      language="sql"
      onChange={(e) => setCode(e.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
    />
  )
}
