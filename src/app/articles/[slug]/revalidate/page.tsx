import { redirect } from "next/navigation"
import { revalidateTag } from 'next/cache'

export default function RevalidatePage({params}: { params: { slug: string }}) {
  revalidateTag(params.slug)
  redirect(`/articles/${params.slug}`)
}