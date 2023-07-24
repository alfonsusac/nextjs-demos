import Link from "next/link"
import Content from "./content.mdx"

const currentPath = '/1-routing/static-vs-dynamic-computation/books/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1 className="text-xl py-2">
      Books
    </h1>
    <p>
      This page shows how dynamic routing converts route into dynamically rendered route
    </p>

    <div className="mt-4">

      <span>[bookID]: </span>

      <Link className="px-2" href={ currentPath + "Harry Potter" }>
        Harry Potter
      </Link>
      <Link className="px-2" href={ currentPath + "Eloquent JavaScript" }>
        Eloquent JavaScript
      </Link>
      <Link className="px-2" href={ currentPath + "Atomic Habit" }>
        Atomic Habit
      </Link>

    </div>

    <div className="mt-4">
      { p.children }
    </div>
  </>
}