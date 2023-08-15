import Image from 'next/image'
import './globals.css'
import { Inter } from 'next/font/google'
import { readFileSync, readdirSync } from 'fs'
import { Category, Page } from './client'
import clsx from 'clsx'
import Link from "next/link"
import "prism-themes/themes/prism-one-dark.min.css"
import path from 'path'
import { cache } from 'react'
import { TOCProvider } from '@/components/toc/context'
import { getHeadings } from '@/components/toc/rsc'
import { ToCSidebar } from '@/components/toc/client'
import MDX_RoutingComputation from "./(demos)/routing/static-vs-dynamic-computation/content.mdx"
import { cn } from '@/components/typography'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next.js Notes',
  description: 'Alfonsusac\'s Next.js Demo',
}

const layoutGenerationTime = new Date()

export default function RootLayout(p: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className="scroll-smooth scroll-p-32">
      <body className={ inter.className + " flex flex-col min-h-screen scroll-smooth" }>

        <Header className="px-4 sticky top-0 sm:pt-4 sm:px-8 bg-black z-50 shadow-xl shadow-black max-w-screen-xl w-full mx-auto" />

        <Content className="flex-auto flex flex-row gap-4 max-w-screen-xl w-full mx-auto">
          <TOCProvider>

            <Sidebar className={ clsx(
              "hidden md:block",
              "flex-shrink-0 bg-black",
              // "sm:border-r border-r-zinc-800",
              "absolute sm:static",
              "w-full sm:w-60",
              "h-full sm:h-auto",
              "pl-4 sm:pl-8"
            ) }>
              <Page label="▼ Home" path='/' />
              <Page label="◩ Articles" category={ `/articles` } path='/articles' >
                <ToCSidebar startDepth={ 2 } />
              </Page>
              
              { dirs.map(category =>

                <li key={ category.name } className="my-8">
                  <ul>

                    <Category label={ category.name } />

                    { category.topics.map(page =>
                      <Page key={ page.title } label={ page.title } category={ `/${category.name}/` } match={ 2 } >
                        <ToCSidebar items={ getHeadings(page.content) } startDepth={ 2 }  />
                      </Page>
                    ) }

                  </ul>
                </li>

              ) }
              <Page label="Trigger 404 by notFound()" path='/self-404' />
              <Page label="Go to default 404" path='/404' />
            </Sidebar>

            <main className={
              cn(
                "w-full mt-8 mb-[40vh] max-w-screen-2xl mx-4 sm:mx-0"
              )
            }>
              { p.children }
            </main>

          </TOCProvider>
        </Content>

      </body>
    </html>
  )

  function Header(p: {
    className: string
  }) {
    return (
      <header className={p.className}>

        <div className="text-2xl font-semibold flex gap-2 items-center py-4 pt-4">
          <Image
            src="https://avatars.githubusercontent.com/u/20208219?v=4"
            width="24"
            height="24"
            alt="Profile Picture"
            className="rounded-2xl w-6 h-6"
          />
          <span className="font-light text-zinc-600">/</span>
          <Link href='/'>
            Next.js Notes
          </Link>
        </div>

      </header>
    )
  }
  function Content(p: { children: React.ReactNode, className: string }) {
    return (
      <main className={ p.className }>
        { p.children }
      </main>
    )
  }
  function Sidebar(p: {
    children: React.ReactNode
    className: string
  }) {
    return (
      <nav className={ p.className }>
        <div className="absolute right-8 sm:hidden">
          <CloseIcon className="w-6 h-6" />
        </div>
        <ul className="sticky top-28">
          { p.children }
        </ul>
      </nav>
    )

    function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"></path></svg>
      )
    }
  }
}

const dirs: {
  name: string,
  topics: {
    title: string,
    content?: JSX.Element
  }[]
}[] = [
  {
    name: "Routing",
    topics: [
      { title: "Static vs Dynamic Computation", content: <MDX_RoutingComputation /> },
      { title: "Dynamic Routes" },
      { title: "Search Params" }
    ]
  },
  {
    name: "Rendering",
    topics: [
      { title: "Prerendering with use client" },
      { title: "React Components" }
    ]
  },
  {
    name: "Fetching",
    topics: [
      { title: "fetch()" }
    ]
  }
]

export { dirs, Category, layoutGenerationTime }
