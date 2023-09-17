import chalk from "chalk"
import chroma from "chroma-js"

export function title(str: string) {
  console.log(" ┌────────────────────────────────────────────────────────────────")
  console.log(" │ " + str)
}

export function verbose( obj :any , depth: 1 | 2 | 3 | 4 | 5 ) {
  const arr = chroma.scale(['2D2F37', 'A1A5B7'])
  const hex = arr(depth - 1 / 4).hex()
  console.log(
    chalk.hex(hex)(obj)
  )
}

//  X ./src/components/notion/parser/parser.ts
export function error( error: any ) {
  console.log(
    chalk.redBright(' ERR: ') + error
  )
}