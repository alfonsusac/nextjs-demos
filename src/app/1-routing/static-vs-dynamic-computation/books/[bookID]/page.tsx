import { ClientSideParams } from "../../cars/[carID]/client"

export default function Page(p: { params: any }) {
  return <div className="p-4 border border-zinc-800 rounded-lg">
    <h1 className="text-xl py-2">
      { p.params.bookID.replace('%20', ' ') }
    </h1>
    <p>This is a dynamic route</p>
  </div>
}