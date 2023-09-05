//https://gist.github.com/filipesmedeiros/c10b3065e20c4d61ba746ab78c6a7a9e

import { type ComponentProps, type ReactElement } from 'react'
import katex, { KatexOptions } from 'katex'
import 'katex/dist/katex.min.css'

export type Props<T extends keyof JSX.IntrinsicElements = 'div'> =
  ComponentProps<T> &
  Partial<{
    as: T
    block: boolean
    errorColor: string
    renderError: (error: any | TypeError) => ReactElement
    settings: KatexOptions
  }> & {
    math: string
  }

export function KaTeXRSC({
  children,
  math,
  block,
  errorColor,
  renderError,
  settings,
  as: asComponent,
  ...props
}: Props) {
  // @ ts-expect-error CSS not JS
  // await import('katex/dist/katex.min.css')

  const Component = asComponent || (block ? 'div' : 'span')
  const content = (children ?? math) as string

  let innerHtml: string
  try {
    innerHtml = katex.renderToString(content, {
      displayMode: !!block,
      errorColor,
      throwOnError: !!renderError,
      ...settings,
    })
  } catch (error) {
    if (error instanceof Error || error instanceof TypeError) {
    // if (error instanceof ParseError || error instanceof TypeError) {
      if (renderError) {
        return renderError(error)
      } else {
        innerHtml = error.message
      }
    } else {
      throw error
    }
  }

  return (
    <Component { ...props } dangerouslySetInnerHTML={ { __html: innerHtml } } />
  )
}