import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export async function GET() {
  
  const data = nanoid(8)
  const date = Date.now()

  return NextResponse.json({
    data, date
  })

}