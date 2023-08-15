import { dirs } from './layout'
import Link from 'next/link'
import { titleCase } from 'title-case'
import { slug } from 'github-slugger'
import { getArticles } from '@/components/notion/data'
import clsx from 'clsx'
import { NotionIcon } from '@/components/notion/rsc/rich-text'

export default async function Home() {

  const articles = await getArticles()

  return (
    <article className="mx-auto">
      <h1>
        Welcome to Alfon&apos;s Next.js Notes
      </h1>
      <h2>
        Demos
      </h2>
      <hr className="mt-4" />
      { dirs.map(category =>
        <>
          <Category key={ category.name } label={ category.name } />
          { category.topics.map(page =>
            <Page key={ page.title } label={ page.title } category={ `/${category.name}/` } />
          ) }
        </>
      ) }


      <h2 className="mb-4">
        Articles
      </h2>
      <hr className="my-4"/>
      <ul className="p-0">
        {
          articles.map(r => (
            <li key={ r.id } className="list-none m-0 transition-all group -my-2 sm:-mx-8">

              <Link
                href={ `/articles/${r.slug}` }
                className={ clsx(
                  // "border border-zinc-600 mb-2",
                  "block p-4 m-0 rounded-md hover:bg-zinc-900/50 no-underline cursor-pointer",
                  "leading-tight",
                  "transition-all"
                ) }
              >

                <div className="flex gap-3">

                  <div className="w-5 h-5 text-lg">
                    <NotionIcon icon={r.icon} />
                  </div>

                  <div>
                    <div className="font-semibold mt-1 group-hover:text-white transition-all">
                      {r.flattenedTitle}
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
    <li className={ "font-normal mt-2 leading-5"}>
      <Link href={ path as any }>
        { titleCase(p.label.replaceAll('-', ' ')) }
      </Link>
    </li>
  )
}
