import Image from 'next/image'
import './globals.css'
import { Inter } from 'next/font/google'
import { readFileSync, readdirSync } from 'fs'
import { Category, Article, Page } from './client'
import clsx from 'clsx'
import Link from "next/link"
import "prism-themes/themes/prism-one-dark.min.css"
import path from 'path'
import { cache } from 'react'
import { TOCProvider } from '@/components/toc/context'
import MDX_RoutingComputation from "./routing/static-vs-dynamic-computation/content.mdx"
import { getHeadings } from '@/components/toc/rsc'
import { ToCSidebar } from '@/components/toc/client'

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
    <html lang="en">
      <body className={ inter.className + " flex flex-col min-h-screen sm:px-8 scroll-smooth	" }>
        <Header />

        <Content>
          <TOCProvider>
            <Sidebar>
              <Page label="▼ Home" path='/' />
              { dirs.map(category =>

                <li key={ category.name } className="my-8">
                  <ul>

                    <Category label={ category.name } />

                    { category.topics.map(page =>
                      <Page key={ page.title } label={ page.title } category={ `/${category.name}/` } >
                        <ToCSidebar items={ getHeadings(page.content) } startDepth={2} depth={6} />
                      </Page>
                    ) }

                  </ul>
                </li>

              ) }
              <Page label="Trigger 404 by notFound()" path='/self-404' />
              <Page label="Go to default 404" path='/404' />
            </Sidebar>

            <main className="w-full">
              <Article>
                { p.children }
              </Article>
            </main>
          </TOCProvider>
        </Content>

      </body>
    </html>
  )
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

const useAppDir = (join?: string) => {
  return path.join(process.cwd(), '/src/app', join ?? "")
}

const useAppBuildManifestPagesList = () => {
  const filepath = path.join(process.cwd(), '.next/app-build-manifest.json')
  const data = JSON.parse(readFileSync(filepath, 'utf-8')) as {
    pages: {
      [key: string]: string[]
    }
  }
  return data.pages
}


const getDirs = cache(() => {

  if (readdirSync(process.cwd()).includes('src')) {
    const dirs = readdirSync(useAppDir(), { withFileTypes: true })
      .filter(file => !file.isFile())
      .map(file => ({
        name: file.name,
        pages: readdirSync(useAppDir(file.name), { withFileTypes: true })
          .filter(subfile => !subfile.name.match(/\./))
          .map(subfile => subfile.name)
      }))
    return dirs
  }

  else {
    // SRC dir doesn't exist, so retrieve from Build Manifest (Serverless Function)

    const routesCache = useAppBuildManifestPagesList()

    let routes: {
      name: string
      pages: string[]
    }[] = []

    for (const route in routesCache) {
      if (route === '/page' || route === '/layout') continue
      const segments = route.split('/').slice(1)
      const categoriesInRoutes = routes.find(r => r.name === segments[0])
      if (categoriesInRoutes) {
        const pagesInCategory = categoriesInRoutes.pages.includes(segments[1])
        if (!pagesInCategory) {
          categoriesInRoutes.pages.push(segments[1])
        }
      } else {
        routes.push({
          name: segments[0],
          pages: []
        })
      }
    }

    return routes
  }
})


function Header() {
  return (
    <header className="px-4 sticky top-0 sm:pt-4 bg-black z-50 shadow-xl shadow-black">

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

function Content(p: { children: React.ReactNode }) {
  return (
    <main className="p-4 flex-auto flex flex-row gap-4">
      { p.children }
    </main>
  )
}

function Sidebar(p: {
  children: React.ReactNode
}) {
  return (
    <nav className={ clsx(
      "hidden md:block",
      "flex-shrink-0 bg-black",
      // "sm:border-r border-r-zinc-800",
      "absolute sm:static",
      "w-full sm:w-60",
      "h-full sm:h-auto",
      ""
    ) }>
      <div className="absolute right-8 sm:hidden">
        <CloseIcon className="w-6 h-6" />
      </div>
      <ul className="sticky top-28">
        { p.children }
      </ul>
    </nav>
  )
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"></path></svg>
  )
}

function getHeaders() {

}




export { getDirs, Category, layoutGenerationTime }
