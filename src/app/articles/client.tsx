'use client'

import { JSONStringify } from "@/components/tool"
import { useRouter } from "next/navigation"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"

export function ArticleList_Error(p: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <ErrorBoundary fallbackRender={ (prop: FallbackProps) => {
      
      return (
        <div className="text-sm text-slate-500">
          <span className="text-sm text-slate-500">Something went wrong when accessing Notion.</span>
          <button type="button" className="ml-2 text-slate-400 underline underline-offset-2" onClick={ () => location.reload() }>
             Click here to retry
          </button>
        </div>
      )
    } }
    >
      {p.children}
    </ErrorBoundary>

  )
}