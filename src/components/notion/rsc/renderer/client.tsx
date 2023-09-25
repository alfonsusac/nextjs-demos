"use client"

import React from "react"
import { ErrorBoundary } from "react-error-boundary"

export function RendererErrorBoundary({ children }: {
  children?: React.ReactNode
}) {
  
  return (
    <ErrorBoundary fallback={
        <span>
          <span>Error rendering component.</span>
          <span className="underline cursor-pointer italic">retry</span>
        </span>
    }>
      {children}
    </ErrorBoundary>
  )

}