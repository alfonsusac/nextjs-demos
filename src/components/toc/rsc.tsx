import innerText from "react-innertext"
import { UseAsTOCContentClient } from "./context"

export type TOCItemType = {
  level: number,
  text: string,
  jsx: JSX.Element,
  id: string,
}

export function getHeadings(mdx?: JSX.Element) {
  
  if (!mdx) return []
  
  const headers: TOCItemType[] = []

  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  visitJSX(mdx, (node) => {
    if (node === '\n') return
    if (typeof node.type === 'string' && headings.includes(node.type)) {

      const { id ,className, ...props} = node.props

      headers.push({
        level: headings.findIndex(h => h === node.type) + 1,
        text: innerText(node),
        jsx: { ...node, props, type: 'span' },
        id: node.props.id
      })
    }
  })

  return headers

}


// Recursively visit jsx
function visitJSX(jsx: JSX.Element, cb: (node: JSX.Element | '\n') => void) {
  if (jsx as any === '\n') return cb(jsx) 
  
  if (typeof jsx !== 'object'
    || !Object.hasOwn(jsx, 'type')
    || !Object.hasOwn(jsx, 'props')
  ) {
    throw new Error('Not a Valid JSX')
  }

  cb(jsx)

  const type = jsx.type
  const props = jsx.props

  if (typeof type === 'function') {
    const children = type(props).props.children
    if (Array.isArray(children)) {
      children.forEach((e: any) => visitJSX(e, cb))
    } else {
      visitJSX(children,cb)
    }
  }

}
export let headings: TOCItemType[] = []

export function TOCContent(p: {
  children: React.ReactNode
}) {
  headings = getHeadings(p.children as React.ReactElement)
  
  return <UseAsTOCContentClient headings={ headings }>
    {p.children}
  </UseAsTOCContentClient>
}
