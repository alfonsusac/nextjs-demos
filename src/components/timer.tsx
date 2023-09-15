import chalk from "chalk"
import chroma from "chroma-js"


function getHex(val: number) {
  const arr = chroma.scale(['2A6258', 'B06B03', 'F43F81']).domain([0, 0.30,1])
  return arr( val/10 ).hex()
}

export function formatSeconds(val:number) {
  return chalk.hex(getHex(val))(val.toPrecision(3))
}

export class Audit {
  private _start: number = performance.now()
  private _last: number = this._start
  private _end: number | null = null
  constructor(private prompt: string, private header: boolean = true) {
    header && console.log(`(${prompt}) Begin Audit : `)
  }
  mark(label: string) {
    this._end = performance.now()
    console.log(`- ${label.padEnd(40) }: ${((this._end - this._last) / 1000).toPrecision(3)} s`)
    this._last = this._end
  }
  total() {
    this._end = performance.now()
    const diff = ((this._end - this._start) / 1000)
    console.log(`${chalk.hex('A0AFBF')('Audit')}: ${`${this.header ? "(total)" : ""} ${this.prompt}`.padEnd(30)}: ${formatSeconds(diff)} s`)
  }
  getSec() {
    this._end = performance.now()
    return ((this._end - this._start) / 1000)
  }
}

export async function audit(prompt: string, cb: () => Promise<any>) {
  const a = new Audit(prompt, false)
  const ret = await cb()
  a.total()
  return ret
}

export function clearLog() {
  console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
}