"use client"

import React from "react"
import { ErrorBoundary } from "react-error-boundary"

export function RendererErrorBoundary({ children }: {
  children?: React.ReactNode
}) {
  
  return (
    <ErrorBoundary
      fallback={<>Error! (RendererErrorBoundary)</>}
      onError={ (error, info) => {
        console.log("Logging Error Boundary:")
        console.log(error)
        console.log(info)
      } }
    >
      {children}
    </ErrorBoundary>
  )

}