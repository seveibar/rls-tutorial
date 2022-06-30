import { useState } from "react"
import dynamic from "next/dynamic"
import "@uiw/react-textarea-code-editor/dist.css"

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
)

interface Props {
  readonly?: boolean
  prefixCode?: string
  code?: string
  language?: string
  onChange?: (string) => any
}

export default ({
  code: initialCode,
  prefixCode = "",
  readonly,
  language = "sql",
  onChange,
}: Props) => {
  const [code, setCode] = useState(initialCode || "")

  return (
    <CodeEditor
      value={prefixCode + code}
      language={language}
      onChange={(e) => {
        if (!readonly) {
          const valueWithoutPrefix = e.target.value.slice(
            prefixCode.length ?? 0
          )
          setCode(valueWithoutPrefix)
          if (onChange) onChange(valueWithoutPrefix)
        }
      }}
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
