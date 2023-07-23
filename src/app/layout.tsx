import Image from 'next/image'
import './globals.css'
import { Inter } from 'next/font/google'
import { readdirSync } from 'fs'
import { Category, Article, Page } from './client'
import clsx from 'clsx'
import Link from "next/link"
import "prism-themes/themes/prism-one-dark.min.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next.js Notes',
  description: 'Alfonsusac\'s Next.js Demo',
}


export default function RootLayout(p: {
  children: React.ReactNode
}) {

  const dirs = getDirs()

  return (
    <html lang="en">
      <body className={ inter.className + " flex flex-col min-h-screen sm:p-8" }>
        <Header />

        <Content>
          <Sidebar>
            <Page label="▼ Home" path='/' />
            { dirs.map(category =>
              <>
                <Category key={ category.name } label={ category.name } />
                { category.pages.map(page =>
                  <Page key={ page } label={ page } path={ `/${category.name}/${page}` } />
                ) }
              </>
            ) }
          </Sidebar>
          
          <Article>
            { p.children }
          </Article>
        </Content>

      </body>
    </html>
  )
}

const getDirs = () => {
  return readdirSync("./src/app", { withFileTypes: true })
    .filter(file => !file.isFile())
    .map(file => ({
      name: file.name,
      pages: readdirSync(`./src/app/${file.name}`, { withFileTypes: true })
        .filter(subfile => !subfile.name.match(/\./))
        .map(subfile => subfile.name)
    })
    )
}

function Header() {
  return (
    <header className="px-4 ">
      <div className="text-2xl font-semibold flex gap-2 items-center py-4 pt-4 border-b border-b-zinc-800">
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
      <div>

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
      "hidden sm:block",
      "flex-shrink-0 border-r-zinc-800 bg-black",
      "absolute sm:static sm:border-r",
      "w-full sm:w-44",
      "h-full sm:h-auto"
    ) }>
      <div className="absolute right-8 sm:hidden">
        <CloseIcon className="w-6 h-6"/>
      </div>
      <ul>
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

function Group(p: {
  children: React.ReactNode
}) {
  return (
    <div className="text-xs font-semibold pt-6">
      { p.children }
    </div>
  )
}


export { getDirs, Category }
