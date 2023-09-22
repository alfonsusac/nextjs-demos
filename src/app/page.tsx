import { dirs } from './layout'
import Link from 'next/link'
import { titleCase } from 'title-case'
import { slug } from 'github-slugger'
import { cn } from '@/components/typography'
import { NotionIcon } from '@/components/notion/rsc/images'
import { getArticleList } from '@/data/articles'
import { LinkBookmark, NotionLinkBookmark } from '@/components/notion/rsc/components/link-previews'


export function IconParkSolidBrowser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" { ...props }><mask id="ipSBrowser0"><g fill="none"><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M42 18v22a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V18"></path><path fill="#fff" stroke="#fff" strokeLinejoin="round" strokeWidth="4" d="M6 8a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v10H6V8Z"></path><path fill="#000" fillRule="evenodd" d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" clipRule="evenodd"></path></g></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSBrowser0)"></path></svg>
  )
}

export default async function Home() {

  function Card(P: {
    title: string
    children: React.ReactNode
    href: string
  }) {
    return (
      <Link href={ P.href } className={ cn(
        "w-full border border-slate-500/10 rounded-xl p-5 bg-gradient-to-bl from-slate-900/20 shadow-inner cursor-pointer transition-all group no-underline",
        "transition-all duration-500",
        "hover:border-slate-800",
        "hover:bg-slate-800/25"
      ) }>
        <div className="text-slate-200 text-xl font-medium pb-1">
          { P.title } <span className="text-slate-600 group-hover:text-blue-500 transition-all">{ '->' }</span>
        </div>
        <div className="text-sm text-slate-400/80">
          { P.children }
        </div>
      </Link>
    )
  }

  return (
    <article className={ cn(
      "mx-auto mt-12 max-w-xl w-full relative",
      "prose-hr:my-4",
    ) }>
      <header className="text-center pt-8 ">
        <div className="text-6xl">
          👋
        </div>
        <h1 className="text-3xl pt-4 tracking-tight">
          Welcome to Alfon&apos;s <br /> Next.js Notes and Tricks
        </h1>
        <p className="text-sm">
          Compilation of stuff that I found interesting when using Next.js
        </p>
      </header>

      <div className="p-8">

      </div>

      <section className="flex flex-col w-full justify-stretch gap-5 sm:flex-row">
        <Card title="Demos" href="/demos">
          Demonstration on various Next.js features
        </Card>
        <Card title="Articles" href="/articles">
          Thoughts on Next.js, based on experience and experiments.
        </Card>
      </section>


      <section className="py-16">
        <div className="w-full flex flex-row justify-center self-center h-0 relative">
          <div className="gradient-spotlight w-full h-[50rem] -mt-[25rem]" />
        </div>
        <header className="pb-8 text-center pt-12">
          <h2 className="text-xl text-slate-50 pb-1 m-0">
            Quick Links
          </h2>
          <p className="text-sm m-0 p-0">
            Websites that I found really helpful
          </p>
        </header>
        <div className="flex flex-col gap-4">
          <LinkBookmark
            url='https://nextjs.org/docs'
            title="Next.js Official Docs"
            description="Welcome to the Next.js Documentation."
            faviconpath="https://nextjs.org/favicon.ico"
            thumbnail="https://nextjs.org/api/og?title=Docs"
          />
          <LinkBookmark
            url='https://nextjs-discord-common-questions.joulev.dev/'
            title="Joulev's Next.js Discord Common Questions"
            description="Collection of his answers to some of the most commonly asked questions on the server"
            faviconpath="https://static.joulev.dev/favicon.ico"
            thumbnail="https://cdn.discordapp.com/attachments/1103539595947278397/1151796086357377084/image.png"
          />
          <LinkBookmark
            url='https://github.com/vercel/next.js/discussions/29628'
            title="Next.js Resources Compiled by Lee Robinson"
            description="This is a discussion thread on GitHub where users share their articles, videos, courses, and blogs about Next.js"
            faviconpath="https://github.githubassets.com/favicons/favicon-dark.svg"
            thumbnail="https://nextjs.org/api/og?title=Resources"
          />
          <LinkBookmark
            url='https://twitter.com/asidorenko_'
            title='Alex Sidorenko (@asidorenko_)'
            description='Making short videos about Next.js'
            faviconpath="https://freelogopng.com/images/all_img/1690643591twitter-x-logo-png.png"
            // thumbnail="https://pbs.twimg.com/profile_banners/4885926545/1691448655/600x200"
          /> 
          <LinkBookmark
            url='https://twitter.com/delba_oliveira'
            title='Delba (@delba_oliveira)'
            description='Developer Experience @Nextjs and @Vercel ▲'
            faviconpath="https://freelogopng.com/images/all_img/1690643591twitter-x-logo-png.png"
            // thumbnail="https://pbs.twimg.com/profile_banners/893035359474524161/1662370145/1500x500"
          />
        </div>
      </section>

      {/* <h2>
        Demos
      </h2>
      <hr />

      <div className={ cn(
        "flex flex-col",
        // "gap-2",
      ) }>
        {
          dirs.map(cat => cat.topics.map(item => <>

            <Link className={ cn(
              "p-1.5 px-4 rounded-md",
              "cursor-pointer",
              "underline decoration-slate-700",

              "hover:bg-slate-900 hover:text-white"
            ) }

              href={ `/demos/${slug(cat.name)}/${slug(item.title)}` }
            >
              <IconParkSolidBrowser className="inline text-base mr-3 mb-1" />
              { item.title }
            </Link>


          </>))
        }
      </div> */}

      {/* {
        dirs.flat(1).map(category =>
          <div key={ category.name } className="p-4 border border-slate-600 rounded-md mb-2">
            <div className="font-semibold ">
              { category.name }
            </div>

            { category.topics.map(page =>
              <Page key={ page.title } label={ page.title } category={ `/${category.name}/` } />
            ) }
          </div>
        )
      } */}


      {/* <h2>
        Articles
      </h2>
      <hr />
      <ul className="p-0">
        {
          articles.map(r => (
            <li key={ r.id } className="list-none transition-all group m-0 -my-2">

              <Link
                href={ `/articles/${r.slug}` }
                className={ cn(
                  // "border border-slate-600 mb-2",
                  "block p-4 m-0 rounded-md hover:bg-slate-900/50 no-underline cursor-pointer",
                  "leading-tight",
                  "transition-all"
                ) }
              >

                <div className="flex gap-3 w-full">

                  <div className="w-5 h-5 text-lg">
                    <NotionIcon icon={ r.icon } />
                  </div>

                  <div className="w-full">
                    <div className="font-semibold mt-1 group-hover:text-white transition-all">
                      { r.flattenedTitle }
                    </div>
                    <div className="text-xs text-slate-500">
                      { new Date(r.last_edited_time).toDateString() }
                    </div>
                  </div>

                </div>
              </Link>

            </li>
          ))
        }
      </ul> */}

    </article>
  )
}


function Category(p: {
  label: string,
}) {
  return (
    <li className={ "text-base font-semibold pt-6 list-none" }>
      { titleCase(p.label) }
    </li>
  )
}

function Page(p: {
  category?: string,
  label: string
  children?: React.ReactNode
  path?: string
}) {
  const path = p.path ?? (p.category !== undefined ? `/${slug(p.category!)}/${slug(p.label)}` : `/${slug(p.label)}`)

  return (
    <li className={ "font-normal mt-2 leading-5" }>
      <Link href={ path as any }>
        { titleCase(p.label.replaceAll('-', ' ')) }
      </Link>
    </li>
  )
}
