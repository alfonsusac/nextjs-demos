import { cn } from "@/components/typography"
import { Header } from "./client"

export default function Layout(p: {
  children: React.ReactNode
}) {
  return (
    <>
      <article className={ cn() }>

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
    </>
  )
}