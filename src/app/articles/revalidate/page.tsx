import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'
export default function RevalidateArticleListPage() {
  revalidatePath('/articles')
  redirect('/articles')
  return <>
    Page Revalidated
  </>
}
