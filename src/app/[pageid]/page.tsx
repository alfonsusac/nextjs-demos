import { redirect } from "next/navigation"

export default async function Page1Page({ params }: any) {

  return redirect(`/${params.pageid}/test`)

}