import Image from 'next/image'
import { getDirs } from './layout'
import Link from 'next/link'
import { titleCase } from 'title-case'

export default function Home() {

  const dirs = getDirs()

  return (
    <>
      <h1>
        Welcome to Alfon&apos;s Next.js Notes
      </h1>
      { dirs.map(category =>
        <>
          <Category key={ category.name } label={ category.name } />
          { category.pages.map(page =>
            <Page key={ page } label={ page } path={ `/${category.name}/${page}` } />
          ) }
        </>
      ) }
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
  path: string,
  label: string
}) {
  return (
    <li className={ "font-normal mt-2 leading-5"}>
      <Link href={ p.path }>
        { titleCase(p.label.replaceAll('-', ' ')) }
      </Link>
    </li>
  )
}
