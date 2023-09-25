import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'
export async function GET(request: any, { params }: any) {
  revalidatePath(`/articles/${params.slug}`)
  redirect(`/articles/${params.slug}`)
  return new Response()
}