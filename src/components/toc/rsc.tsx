import innerText from "react-innertext"
import { UseAsTOCContentClient } from "./context"

export type TOCItemType = {
  level: number,
  text: string,
  jsx?: JSX.Element,
  id: string,
}

export async function getHeadings(mdx?: JSX.Element) {
  
  if (!mdx) return []

  
  const headers: TOCItemType[] = []

  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  await visitJSX(mdx, (node) => {
    if (node === '\n') return
    if (typeof node?.type === 'string' && headings.includes(node.type)) {
      
      console.log("FOUNDDD!!!!!!!!!!")

      const { id ,className, ...props} = node.props

      headers.push({
        level: headings.findIndex(h => h === node.type) + 1,
        text: innerText(node),
        jsx: { ...node, props, type: 'span' },
        id: node.props.id
      })
    }
  })

  console.log("HEADERS")
  console.log(headers)
  return headers

}


// Recursively visit jsx
async function visitJSX(jsx: JSX.Element, cb: (node: JSX.Element | '\n') => void, depth = 1) {

  // console.log('\n JSX: ' + depth)
  // console.log(JSON.stringify(jsx, null, 1))

  if (jsx as any === '\n') return cb(jsx) 
  
  if (typeof jsx !== 'object'
    || !Object.hasOwn(jsx, 'type')
    || !Object.hasOwn(jsx, 'props')
  ) {
    // console.log("Not A Valid JSX:")
    throw new Error('Not a Valid JSX')
  }

  // console.log(jsx.type)

  cb(jsx)

  const type = jsx.type
  const props = jsx.props

  if (typeof type === 'function') {
    // console.log("A ")

    // console.log(await type(props))

    const comp = (await type(props))
    const children = comp?.props?.children

    // console.log("Comp: "+ depth)
    // console.log(jsx)
    // console.log(comp)
    // console.log('\n')

    cb(comp)

    

    // console.log("B")

    // console.log(children)
    
    if (children) {
      // console.log("Children")
      if (Array.isArray(children) === true) {
        // children.forEach((e: any) => visitJSX(e, cb))
        for (const child of children) {
          try {
            await visitJSX(child, cb, depth + 1)
          } catch (error) { }
        }
        // await Promise.allSettled(children.map(async (e: any) => await visitJSX(e, cb, depth + 1)))
      } else{
        await visitJSX(children, cb, depth + 1)
      }

    } else {

      // For async components
      const childrenasync = comp
  
      if (childrenasync) {

        // console.log("ChildrenAsync")

        cb(childrenasync)
  
        if (Array.isArray(childrenasync) === true) {
          for (const childasync of childrenasync) {
            try {
              await visitJSX(childasync, cb, depth + 1)
            } catch (error) { }
          }
          // await Promise.allSettled(childrenasync.map(async (e: any) => await visitJSX(e, cb, depth + 1)))
          // childrenasync.forEach(async (e: any) => await visitJSX(e, cb))
        } else {
          await visitJSX(childrenasync, cb, depth + 1)
          // console.log("NOT ARRAY?")
          // console.log(comp)
        }
  
      }

    }
    
  } else {
    // console.log("Not Function: ")
    // console.log(jsx)
    // console.log('\n')

  }


}
export let headings: TOCItemType[] = []

export async function TOCContent(p: {
  children: React.ReactNode
}) {
  headings = await getHeadings(p.children as React.ReactElement)

  return <UseAsTOCContentClient headings={ headings }>
    {p.children}
  </UseAsTOCContentClient>
}
