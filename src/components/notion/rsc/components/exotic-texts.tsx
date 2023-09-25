import { CodeRSC } from "@/components/code-snippet/rsc"
import { NotionComponentProp } from "../renderer/notion-ast-renderer"
import { KaTeXRSC } from "@/components/katex/rsc"
import { flattenRichText } from "../rich-texts/utils"
import Mermaid from "../../mermaid/mermaid"

// ! Colors not yet working
export function CodeBlock({
  node
}: NotionComponentProp<'code'>) {

  if (node.props.language === 'mermaid')
    return (
      <Mermaid chart={ flattenRichText(node.props.rich_text) } />
    )

  return (
    <CodeRSC
      language={ node.props.language }
      title={ flattenRichText(node.props.caption) }
      code={ flattenRichText(node.props.rich_text) } />
  )

}



export function EquationBlock({
  node
}: NotionComponentProp<'equation'>) {

  return (
    <KaTeXRSC
      className="py-2 hover:bg-slate-900"
      math={ node.props.expression }
      block
      settings={ {
        strict: false
      }}
    />
  )

}