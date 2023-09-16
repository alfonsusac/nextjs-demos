import { redirect } from "next/navigation"
import { revalidatePath, revalidateTag } from 'next/cache'

export default function RevalidatePage({params}: { params: { slug: string }}) {
  revalidateTag(params.slug)
  revalidatePath(`/articles/${params.slug}`)
  redirect(`/articles/${params.slug}`)
}