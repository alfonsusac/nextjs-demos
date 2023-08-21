import { cn } from "@/components/typography"
import { Header } from "./client"
import { Category, dirs } from "../layout"
import { Page } from "../client"
import { ToCSidebar } from "@/components/toc/client"
import { getHeadings } from "@/components/toc/rsc"
import { slug } from "github-slugger"

export default async function Layout(p: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* LEFT */}

      <Sidebar className={ cn(
        "hidden md:block",
        "flex-shrink-0 bg-black",
        "absolute sm:static",
        "w-full sm:w-56",
        "h-full sm:h-auto",
        "pl-4 sm:pl-8",
      ) }>

        { dirs.map(category =>

          <li key={ category.name } className="py-2">
            <ul className="space-y-2">

              <Category label={ category.name } />

              { category.topics.map(async page =>
                <Page
                  key={ page.title }
                  label={ page.title }
                  path={`/demos/${slug(category.name)}/${slug(page.title)}`}
                  match={ 2 }
                  className="text-sm"
                >
                  <ToCSidebar items={ await getHeadings(page.content) } startDepth={ 2 } />
                </Page>
              ) }

            </ul>
          </li>

        ) }
        <Page label="Trigger 404 by notFound()" path='/self-404' />
        <Page label="Go to default 404" path='/404' />
      </Sidebar>
 
      

      {/* RIGHT */}

      <div className="w-full mx-4">
        <article>

          <Header />

          { p.children }

          <footer className="mt-12 py-12 border-t border-t-zinc-600 text-zinc-500 text-sm space-y-2 leading-normal">
            <p>
              The content on this website are purely written by Alfon to help people better understand how Next.js works and are not affiliated with Vercel (unofficial).
            </p>
            <p>
              If you have any comments for improvement on the website or the content feel free to visit <a href="https://github.com/alfonsusac/nextjs-demos/issues">the respository</a> which is 100% open source.
            </p>
            <p>
              Written by <a href="https://github.com/alfonsusac">@alfonsusac</a>
            </p>
          </footer>

        </article>
      </div>

    </>
  )
}

export function Sidebar(p: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <nav className={ p.className }>
      {/* <div className="absolute right-8 sm:hidden">
        <CloseIcon className="w-6 h-6" />
      </div> */}
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