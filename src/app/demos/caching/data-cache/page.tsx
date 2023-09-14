import { GetDataResponse } from "@/app/api/getData/route"
import { Data_BackgroundRevalidation_Client } from "./client"
import { unstable_cache } from "next/cache"
import { nanoid } from "nanoid"

const currentPath = '/routing/static-vs-dynamic-computation/books/'

export const dynamic = 'force-dynamic';

export default async function Page() {

  const cache = await unstable_cache( async () => ({ date: Date.now(), data: nanoid(8) }),
    [],
    { revalidate: 30 }
  )()

  const renderTime = Date.now()

  return <>

    <h1>❔ Acme Inc.</h1>
    <p>
      This demo shows the difference in behavior between all the settings involved in caching a data using the Data Cache
    </p>
    <p>
      This route is statically computed hence it uses build cache by default
    </p>
    <Data_BackgroundRevalidation revalidate={ 10 } length={ 2 } />
    <Data_BackgroundRevalidation revalidate={ 30 } length={ 4 } />
    <Data_BackgroundRevalidation revalidate={ 60 } length={ 8 } />
  </>
}

async function Data_BackgroundRevalidation({revalidate, length}:{ revalidate?: number, length: number }) {
  
  const cache = await unstable_cache(
    async () => ({ date: Date.now(), data: nanoid(length) }),
    ['' + revalidate, '' + length],
    { revalidate }
  )()

  const renderTime = Date.now()

  return <div className="rounded-lg border border-slate-700 bg-slate-950 p-1 px-3 mt-4">
    <p>
      Fetch result = <code>{ cache.data }</code> <br />
    </p>
    <Data_BackgroundRevalidation_Client
      fetchTime={ cache.date }
      renderTime={ renderTime }
      duration={ revalidate }
    />
  </div>
}