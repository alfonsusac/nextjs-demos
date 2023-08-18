import Image from 'next/image'
import './globals.css'
import { Inter } from 'next/font/google'
import { Category, Page } from './client'
import Link from "next/link"
import "prism-themes/themes/prism-one-dark.min.css"
import { TOCProvider } from '@/components/toc/context'
import MDX_RoutingComputation from "./demos/routing/static-vs-dynamic-computation/content.mdx"
import { cn } from '@/components/typography'

const inter = Inter({
  subsets: ['latin'],
  display: 'block'
})

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
      <body className={ cn(
        inter.className,
        "flex flex-col min-h-screen scroll-smooth",
        "bg-black",

        "prose-h1:text-3xl",
        "prose-h1:font-semibold",
        "prose-h1:text-zinc-200",

        "prose-h2:text-2xl",
        "prose-h2:font-semibold",
        "prose-h2:mt-12",
        "prose-h2:text-zinc-200",

        "prose-h3:text-xl",
        "prose-h3:font-semibold",
        "prose-h3:mt-8",
        "prose-h3:text-zinc-200",

        "prose-h4:text-lg",
        "prose-h4:font-semibold",
        "prose-h4:mt-4",
        "prose-h4:text-zinc-200",

        "prose-code:bg-zinc-400/20",
        "prose-code:text-sm",
        // "prose-code:font-semibold",
        "prose-code:font-px-1",
        "prose-code:rounded-sm",
        "prose-code:py-[0.15rem]",
        "prose-code:!leading-[1.2]",
        "prose-code:inline-block",

        "prose-pre:border",
        "prose-pre:rounded-lg",
        "prose-pre:border-zinc-800",
        "prose-pre:bg-zinc-950",
        "prose-pre:font-normal",
        
        "prose-li:marker:text-zinc-500"

      ) }>

        <Header className="sticky top-0 sm:pt-4 sm:px-8 bg-black z-50 shadow-xl shadow-black w-full" />

        <TOCProvider>
          <Content className="max-w-screen-lg w-full mx-auto px-4">
            <div className={ cn(
              "w-full",
              "max-w-screen-2xl sm:mx-auto",
              "mt-8 mb-[40vh]",
              "flex flex-row gap-4",
            )
            }>
              { p.children }
            </div>
          </Content>
        </TOCProvider>

      </body>
    </html>
  )

  function Header(p: {
    className: string
  }) {
    return (
      <header className={ cn(
        p.className,
        "flex flex-row gap-6 items-center h-14",
      ) }>

        <div className={ cn(
          "max-w-screen-lg mx-auto w-full gap-6 items-center px-4",
          "flex flex-row",
        ) }>

          <div className="text-2xl font-semibold gap-2 items-center py-4 pt-4 hidden sm:flex">
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

          <Page className="my-4"
            as="div" label="▼ Home" path='/' />
          <Page className="my-4"
            as="div" label="▧ Demos" category={ `/demos` } path='/demos' />
          <Page className="my-4"
            as="div" label="◩ Articles" category={ `/articles` } path='/articles' />
          
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
