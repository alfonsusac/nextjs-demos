import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

export async function GET(){
  revalidateTag('Test')
  return NextResponse.json({ result: true, rnd: Math.random() })
}