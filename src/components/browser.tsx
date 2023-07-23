'use client'

import clsx from "clsx"
import { SVGProps, useState, useEffect } from "react"
import { usePathname, useSelectedLayoutSegments, useRouter } from "next/navigation"
import Link from "next/link"
import path from "path"

export function Browser(p: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full border border-zinc-600 rounded-xl min-h-96 mb-12">
      <Header>
        <BackButton />
        <ForwardButton />
        <BreadCrumb />
      </Header>
      <div className="p-4 space-y-2">
        { p.children }
      </div>
    </div>
  )
}

function Header(p: {
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-bottom-zinc-600s max-w-full h-10 border-b-zinc-600 flex flex-row items-center p-4 space-x-1">
      { p.children }
    </div>
  )
}


function BackButton() {
  const [disabled, setDisabled] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log(history.state.tree[1].children)
  }, [])

  return (
    <Button onClick={ () => router.back() }>
      <BackLogo className={ clsx("w-5 h-5", disabled ? "text-zinc-500" : "") } />
    </Button>
  )
}


function ForwardButton() {
  const [disabled, setDisabled] = useState(true)
  const router = useRouter()

  useEffect(() => {

  }, [])

  return (
    <Button onClick={ () => router.forward() }>
      <ForwardLogo className={ clsx("w-5 h-5", disabled ? "text-zinc-500" : "") } />
    </Button>
  )
}


function BreadCrumb() {

  const homePath = usePathname()
  const firstTwoSegment = '/' + homePath.split('/').slice(1, 3).join('/')
  const segmentPaths = useSelectedLayoutSegments()
    .filter(segment => !segment.startsWith('('))

  return (
    <div className="w-full">
      <Link href={ firstTwoSegment } className="text-zinc-600">acme.com</Link>
      <span>/</span>
      {
        segmentPaths.map((s, i) => {
          const link = path.join(firstTwoSegment, ...segmentPaths.slice( 0, segmentPaths.findIndex( p => p === s ) + 1 ) )
          return i === 0 ?
            <Link key={ i } href={ link }>{ s }</Link> :
            <>
              <span key={ 2 * i + 1 }>/</span>
              <Link key={ 2 * i } href={ link } >{ s }</Link>
            </>
        }
        )
      }
    </div>
  )
}


function Button(p: { children: React.ReactNode, onClick?: () => void }) {
  return (
    <div className="h-7 w-7 hover:bg-zinc-800 rounded-md flex items-center justify-center cursor-pointer" onClick={ p.onClick }>
      { p.children }
    </div>
  )
}


function BackLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6L12 20Z"></path></svg>
  )
}

function ForwardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="m12 20l-1.425-1.4l5.6-5.6H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8Z"></path></svg>
  )
}
