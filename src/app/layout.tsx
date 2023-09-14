import Image from 'next/image'
import './globals.css'
import { Inter } from 'next/font/google'
import { Category, Content, Page } from './client'
import Link from "next/link"
import "prism-themes/themes/prism-one-dark.min.css"
import MDX_RoutingComputation from "./demos/routing/static-vs-dynamic-computation/content.mdx"
import MDX_Test from "./demos/routing/static-vs-dynamic-computation/text.mdx"
import { cn } from '@/components/typography'

const inter = Inter({
  subsets: ['latin'],
  display: 'block'
})

export const metadata = {
  title: {
    template: '%s | Next.js Notes',
    default: 'Next.js Notes'
  },
  description: 'Alfonsusac\'s Next.js Demo',
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  colorScheme: 'dark',
  creator: '@alfonsusac',
  openGraph: {
    siteName: 'Next.js Tricks',
  }
}

const layoutGenerationTime = new Date()

export default function RootLayout(p: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">

      <body className={ cn(`${inter.className} 
        flex 
        flex-col 
        min-h-screen
      `) }>

        <Header className={ cn(`
          sticky 
          top-0 
          bg-black 
          z-50 
          shadow-xl 
          shadow-black 

          sm:pt-4 
          sm:px-8`
        ) } />

        <Content className={ cn(`
            max-w-screen-lg
            w-full
            mx-auto
            px-4
            mt-8 
            mb-[20vh]
            flex flex-row gap-4
            min-h-screen
          `) }>

            { p.children }

        </Content>

      </body>

    </html>
  )

  function Header(p: {
    className: string
  }) {
    return (
      <header className={ cn(p.className, `
        h-14
        flex
        flex-row
        gap-6
        items-center
      `) }>

        <div className={ cn(
          "max-w-screen-lg mx-auto w-full gap-6 items-center px-4",
          "flex flex-row",
          "justify-center"
        ) }>

          <div className="text-2xl font-semibold gap-2 items-center py-4 pt-4 hidden sm:flex">
            <Image
              src="https://avatars.githubusercontent.com/u/20208219?v=4"
              width="24"
              height="24"
              alt="Profile Picture"
              className="rounded-2xl w-6 h-6"
            />
            {/* <span className="font-light text-zinc-600">/</span> */}
            {/* <Link href='/'>
              Next.js Notes
            </Link> */}
          </div>

          <Page className="my-4"
            as="div" label="▼ Home" path='/' />
          <Page className="my-4"
            as="div" label="▧ Demos" path='/demos' />
          <Page className="my-4"
            as="div" label="◩ Articles" path='/articles' />

        </div>


      </header>
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
    },
    {
      name: "Caching",
      topics: [
        { title: "Data Cache"}
      ]
    }
  ]

export { dirs, Category, layoutGenerationTime }
