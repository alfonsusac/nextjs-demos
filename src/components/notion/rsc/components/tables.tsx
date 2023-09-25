import { cn } from "@/components/typography"
import { NotionComponentProp } from "../renderer/notion-ast-renderer"
import { NodeTypes } from "../../types"
import { NotionRichText } from "../rich-texts/parser"
import { convertBlockListToASTSync } from "../../parser/parser"
import { Cache } from "@/lib/cache"

export async function TableBlock({
  className,
  node,
}: NotionComponentProp<'table'>) {

  const { has_row_header, has_column_header } = node.props

  if (!node.has_children) return <>No child</>
  
  let rows = node.children as NodeTypes['table_row'][]


  // Important!!!
  // if (!rows.length) {
  //   rows = convertBlockListToASTSync(await Cache.getChildren(node.id)).children as NodeTypes['table_row'][]
  // }
  // if (!rows.length) return <>Incomplete Table</>
  


  const [headRow, ...rest] = rows


  return (
    <table className={ className } >
      {
        has_column_header === true ? (
          <thead>
            <tr>
              {
                headRow.props.cells.map((c, i) =>

                  <th scope="row" key={ i }>
                    <NotionRichText rich_text={ c } />
                  </th>

                ) }
            </tr>
          </thead>
        ) : null
      }
      <tbody>
        {
          (has_column_header ? rest : rows).map((c, i) =>
            <tr key={ i }>
              {
                c.props.cells.map((c, i) =>

                  has_row_header && i === 0 ? (

                    <th scope="col" key={ i }>
                      <NotionRichText rich_text={ c } />
                    </th>

                  ) : (

                    <td key={ i }>
                      <NotionRichText rich_text={ c } />
                    </td>

                  )

                ) }
            </tr>
          )
        }
      </tbody>
    </table>
  )

}



export function TableRow() {
  return <></>
}