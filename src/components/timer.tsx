

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
}


export function MeasureRender(p:{children:React.ReactNode}) {
  

}