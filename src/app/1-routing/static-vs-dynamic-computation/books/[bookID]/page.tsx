import { ClientSideParams } from "./client"

export default function Page() {
  return <div className="p-4 border border-zinc-800 rounded-lg">
    <h1 className="text-xl py-2"><ClientSideParams/></h1>
  </div>
}

export const dynamic = 'force-static'