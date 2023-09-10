

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
    console.log(`- ${`${this.header ? "(total)" : ""} ${this.prompt}`.padEnd(40)}: ${((this._end - this._start) / 1000).toPrecision(3)} s`)
  }
  getSec() {
    this._end = performance.now()
    return ((this._end - this._start) / 1000)
  }
}

export async function audit(prompt: string, cb: () => Promise<any>) {
  const a = new Audit(prompt)
  const ret = await cb()
  a.total()
  return ret
}

export function clearLog() {
  console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
}