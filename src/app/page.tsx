import { dirs } from './layout'
import Link from 'next/link'
import { titleCase } from 'title-case'
import { slug } from 'github-slugger'
import { getArticles } from '@/components/notion/data'
import clsx from 'clsx'
import { NotionIcon } from '@/components/notion/rsc/rich-text'
import { cn } from '@/components/typography'


export function IconParkSolidBrowser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" { ...props }><mask id="ipSBrowser0"><g fill="none"><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M42 18v22a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V18"></path><path fill="#fff" stroke="#fff" strokeLinejoin="round" strokeWidth="4" d="M6 8a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v10H6V8Z"></path><path fill="#000" fillRule="evenodd" d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" clipRule="evenodd"></path></g></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSBrowser0)"></path></svg>
  )
}

export default async function Home() {

  const articles = await getArticles()

  return (
    <article className={ cn(
      "mx-auto mt-12 prose-hr:my-4",
      "prose-hr:my-4",
      // "prose-hr:border-t-zinc-800",

      "prose-h2:mb-4",
      "prose-h2:text-center",


    ) }>
      <h1 className="text-center">
        Welcome to Alfon&apos;s Next.js Notes
      </h1>

      <h2>
        Demos
      </h2>
      <hr/>

      <div className={ cn(
        "flex flex-col",
        // "gap-2",
      ) }>
        {
          dirs.map(cat => cat.topics.map(item => <>
          
            <Link className={ cn(
              "p-1.5 px-4 rounded-md",
              "cursor-pointer",              
              // "outline outline-1 outline-zinc-800",
              "underline decoration-zinc-700",
              "mx-0 sm:-mx-8",
              // "shadow-[0px_0px_200px_80px_#ffffff22]",

              "hover:bg-zinc-900 hover:text-white"
            ) }
            
              href={ `/demos/${slug(cat.name)}/${slug(item.title)}` }
            >
              <IconParkSolidBrowser className="inline text-base mr-3 mb-1" />
              {item.title}
            </Link>
          
          
          </>))
        }
      </div>

      {/* {
        dirs.flat(1).map(category =>
          <div key={ category.name } className="p-4 border border-zinc-600 rounded-md mb-2">
            <div className="font-semibold ">
              { category.name }
            </div>

            { category.topics.map(page =>
              <Page key={ page.title } label={ page.title } category={ `/${category.name}/` } />
            ) }
          </div>
        )
      } */}


      <h2>
        Articles
      </h2>
      <hr/>
      <ul className="p-0">
        {
          articles.map(r => (
            <li key={ r.id } className="list-none m-0 transition-all group -my-2 sm:-mx-8">

              <Link
                href={ `/articles/${r.slug}` }
                className={ cn(
                  // "border border-zinc-600 mb-2",
                  "block p-4 m-0 rounded-md hover:bg-zinc-900/50 no-underline cursor-pointer",
                  "leading-tight",
                  "transition-all"
                ) }
              >

                <div className="flex gap-3">

                  <div className="w-5 h-5 text-lg">
                    <NotionIcon icon={ r.icon } />
                  </div>

                  <div>
                    <div className="font-semibold mt-1 group-hover:text-white transition-all">
                      { r.flattenedTitle }
                    </div>
                    <div className="text-xs text-zinc-500">
                      { new Date(r.last_edited_time).toDateString() }
                    </div>
                  </div>

                </div>
              </Link>

            </li>
          ))
        }
      </ul>

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
