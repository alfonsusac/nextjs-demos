import { dirs } from './layout'
import Link from 'next/link'
import { titleCase } from 'title-case'
import { slug } from 'github-slugger'
import { getArticles, notion } from '@/components/notion/data'

export default async function Home() {

  const articles = await getArticles()

  return (
    <>
      <h1>
        Welcome to Alfon&apos;s Next.js Notes
      </h1>
      <h2>
        Demos
      </h2>
      { dirs.map(category =>
        <>
          <Category key={ category.name } label={ category.name } />
          { category.topics.map(page =>
            <Page key={ page.title } label={ page.title } category={ `/${category.name}/` } />
          ) }
        </>
      ) }

      <h2>
        Articles
      </h2>
      <ul className="p-0">
        {
          articles.map(r => (
            <li key={ r.id } className="list-none m-0 mb-2">
              <Link
                href={ `/articles/${r.slug}` }
                className="block border border-zinc-600 p-4 m-0 rounded-md hover:bg-zinc-900/50 no-underline cursor-pointer">
                <div className="font-semibold">
                  {r.title}
                </div>
                <div className="text-sm text-zinc-500">
                  { new Date(r.last_edited_time).toDateString() }
                </div>
              </Link>
            </li>
          ))
        }
      </ul>
      
    </>
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
