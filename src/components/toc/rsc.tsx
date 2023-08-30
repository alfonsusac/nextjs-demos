import innerText from "react-innertext"
import { UseAsTOCContentClient } from "./context"
import { ReactNode } from "react"
import { slug } from "github-slugger"

export type TOCItemType = {
  level: number,
  text: string,
  jsx?: JSX.Element,
  id: string,
}

export async function getHeadings(mdx?: JSX.Element) {

  if (!mdx) {
    // console.warn("GetHeading: Not MDX")
    return []
  }

  const headers: TOCItemType[] = []

  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  await visitJSX2(mdx, (type) => {

    if (type.intrinsic && headings.includes(type.intrinsic.type)) {
      const node = type.intrinsic
      const { ...props } = node.props

      delete props['className']
      delete props['id']

      const text = innerText(node)

      const header:TOCItemType = {
        level: headings.findIndex(h => h === node.type) + 1,
        text: innerText(node),
        jsx: { ...node, props, type: 'span' },
        id: slug(text)
      }

      headers.push(header)

    }

  })

  return headers

}

/**
 * Function to do inorder traversal on ReactNode 
 * 
 * Figma: https://www.figma.com/file/o8BlRzxU0XHllNYEcaJZSC/Learn?type=design&node-id=165%3A194&mode=design&t=K17WgqtrFBvJ28gQ-1
 * Gist: https://gist.github.com/alfonsusac/01a9562a3883e196af6c7c7addc06b54
 */
async function visitJSX2(
  jsx: ReactNode,
  cb: (p: {
    primitive?: string | number | boolean,
    fragment?: React.ReactElement<null>
    intrinsic?: React.ReactElement<any, keyof JSX.IntrinsicElements>
    custom?: React.ReactElement<any, any>
  }) => void
) {

  // console.log("---------------\nVisitJSX")
  const queue: ReactNode[] = []
  const depthArr: number[] = [] // to keep track the depth of current node on the tree

  queue.push(jsx)
  depthArr.push(1) 

  while (queue.length > 0) {

    const curr = queue.pop()
    const depth = depthArr.pop()

    const print = (message: any) => {
      // console.log(Array.from({ length: depth ?? 1 }).map(() => ' | ').join('') + message)
    }

    if (typeof curr === 'string' || typeof curr === 'number' || typeof curr === 'boolean') {
      // print("Primitives: " + JSON.stringify(curr))
      print(JSON.stringify(curr))
      cb({ primitive: curr })
      continue
    }


    if (curr === null) {
      print("Null")
      continue
    }
    if (curr === undefined) {
      print("Undefined")
      continue
    }


    if (Symbol.iterator in curr) {

      // print("Iterable Array Found!")
      if (Array.isArray(curr)) {

        print("[arr]")
        // print("Iterable<NodeElement>")
        for (var i = curr.length - 1; i >= 0; i--) {
          // console.log(curr[i])
          queue.push(curr[i])
          depthArr.push((depth ?? 1) + 1)
        }

      } else {
        print("Iterable but not an array?")
      }
      continue
    }


    if ('type' in curr) {

      // A custom component can consists of another function or a intrinsic element
      const type = curr.type as Function | symbol | string
      // cb(curr)

      if (typeof type === 'function') {

        // print("Functional Component (Push): " + type.name)
        cb({ custom: curr })
        print(type.name)
        try {

          const comp = await type(curr.props)
          queue.push(comp)
          depthArr.push((depth ?? 1) + 1)

        } catch (error: any) {

          const msg = error.message as string
          if (msg.includes('Client Component')) {
            print("Can't process client components yet")
          } else {
            console.log("ERROR`!")
            console.log(error.message as string)
            throw error
          }

        }
        // queue.push(await type(curr.props))
        continue

      }
      else if (typeof type === 'symbol' || typeof type === 'string') {

        if (typeof type === 'symbol') {
          if (type.toString() === 'Symbol(react.fragment)') {
            cb({ fragment: curr })
            print('<>')
          } else {
            print("Unknown Symbol Found: " + type.toString())
          }
        }

        if (typeof type === 'string') {
          // print("Intrinsic Elements: "+ type)
          cb({ intrinsic: curr as any })
          print(type)
        }

        const props = curr.props
        if ('children' in props) {
          // print("Has Children (Push)")
          queue.push(props.children)
          depthArr.push((depth ?? 1) + 1)
          continue

        }

      } else {

        print("Unknown 'type' type: " + type)
        print(type)
        continue

      }


    } else {

      console.log("Unknown 'curr' node type: " + curr)
      console.log(curr)
      continue

    }

    
  }



}


// Recursively visit jsx
// async function visitJSX(jsx: JSX.Element, cb: (node: JSX.Element | '\n') => void, depth = 1) {

//   // console.log('\n JSX: ' + depth)
//   console.log('\n JSX: ' + depth + JSON.stringify(jsx).slice(0, 100))
//   console.log(jsx)
//   // console.log(JSON.stringify(jsx, null, 1))

//   if (jsx as any === '\n') return cb(jsx)

//   if (typeof jsx !== 'object'
//     || !Object.hasOwn(jsx, 'type')
//     || !Object.hasOwn(jsx, 'props')
//   ) {
//     // console.log("Not A Valid JSX:")
//     throw new Error('Not a Valid JSX')
//   }
//   console.log("A ")


//   // console.log(jsx.type)

//   cb(jsx)

//   const type = jsx.type
//   const props = jsx.props

//   if (typeof type === 'function') {
//     console.log("B ")


//     // console.log(await type(props))

//     const comp = (await type(props))
//     const children = comp?.props?.children

//     // console.log("Comp: "+ depth)
//     // console.log(jsx)
//     console.log(comp)
//     // console.log('\n')

//     cb(comp)



//     // console.log("B")

//     // console.log(children)

//     if (children) {
//       console.log("Children")

//       if (Array.isArray(children) === true) {
//         console.log("Multiple")


//         // children.forEach((e: any) => visitJSX(e, cb))
//         for (const child of children) {
//           try {
//             await visitJSX(child, cb, depth + 1)
//           } catch (error) { }
//         }
//         // await Promise.allSettled(children.map(async (e: any) => await visitJSX(e, cb, depth + 1)))
//       } else {
//         console.log("Single")

//         await visitJSX(children, cb, depth + 1)
//       }

//     } else {
//       console.log("No Children/Async")

//       // For async components
//       const childrenasync = comp

//       if (childrenasync) {

//         // console.log("ChildrenAsync")

//         cb(childrenasync)

//         if (Array.isArray(childrenasync) === true) {
//           for (const childasync of childrenasync) {
//             try {
//               await visitJSX(childasync, cb, depth + 1)
//             } catch (error) { }
//           }
//           // await Promise.allSettled(childrenasync.map(async (e: any) => await visitJSX(e, cb, depth + 1)))
//           // childrenasync.forEach(async (e: any) => await visitJSX(e, cb))
//         } else {
//           await visitJSX(childrenasync, cb, depth + 1)
//           // console.log("NOT ARRAY?")
//           // console.log(comp)
//         }

//       }

//     }

//   } else {
//     // console.log("Not Function: ")
//     // console.log(jsx)
//     // console.log('\n')

//   }


// }


export let headings: TOCItemType[] = []

export async function TOCContent(p: {
  children: React.ReactNode
}) {
  headings = await getHeadings(p.children as React.ReactElement)
  // console.log("TOCContent")
  // console.log(headings)

  return <UseAsTOCContentClient headings={ headings }>
    { p.children }
  </UseAsTOCContentClient>
}
