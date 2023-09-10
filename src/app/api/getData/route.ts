import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export type GetDataResponse = Awaited<
  ReturnType<
    typeof GET
  >
> extends NextResponse<infer T> ? T : never

export async function GET() {
  const data = nanoid(8)
  const date = Date.now()
  return NextResponse.json({
    data, date
  })
}

