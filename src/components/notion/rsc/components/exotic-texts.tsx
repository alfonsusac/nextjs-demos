import { CodeRSC } from "@/components/code-snippet/rsc"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { flattenRichText } from "../rich-text"
import { KaTeXRSC } from "@/components/katex/rsc"

// ! Colors not yet working
export function CodeBlock({
  node
}: NotionComponentProp<'code'>) {

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
      className="py-2 hover:bg-zinc-900"
      math={ node.props.expression }
      block/>
  )

}