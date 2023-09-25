"use client"

import { Callback } from "@/helper/types"
import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary, FallbackProps, useErrorBoundary } from "react-error-boundary"

// export function CLientActionRunner<P extends any[], R extends React.ReactNode>({ action, param }: {
//   action: (...args: P) => Promise<R>,
//   param: P,

// }) {

//   return (
//     <>
//       {/* <ErrorBoundary fallbackRender={ ClientNastRendererError }> */ }
//       {/* <Suspense fallback="Loading suspense in client side??"> */ }
//       <ClientActionRunnerInternal action={ action } param={ param } />
//       {/* </Suspense> */ }
//       {/* </ErrorBoundary> */ }
//     </>
//   )
// }

export function ClientActionRunner<P extends any[]>({ action, param, error }: {
  action: (...args: P) => Promise<React.ReactNode>,
  param: P,
  error?: string,
}) {

  const [component, setComponent] = useState<React.ReactNode | null>()
  const [displayError, setDisplayError] = useState(error)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    if (!component && !displayError) {
      action(...param)
        .then(comp => {
          console.log(comp)
          setComponent(comp)
        })
        .catch(error => setDisplayError(error.toString()))
        .finally(() => setRetrying(false))
    }
  }, [component, action, param, displayError])

  if (displayError) return <>
    <span>Error fetching this block at client side. Error: { displayError }</span>
    {
      retrying ?
        <span className="underline italic">retrying...</span> :
        <span className="underline italic cursor-pointer" onClick={ () => {
          setRetrying(true)
          setDisplayError(undefined)
          setComponent(null)
        } }>retry</span>
    }
  </>

  return component ?? "Loading..."
}
