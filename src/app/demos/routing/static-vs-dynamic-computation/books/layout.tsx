import { InlineLink } from "@/components/link"

const currentPath = '/demos/routing/static-vs-dynamic-computation/books/'

export default function Layout(p: { children: React.ReactNode }) {
  return <>
    <h1>📚 Books</h1>
    <p>
      This page shows how dynamic routing converts route into dynamically rendered route
    </p>
    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "Harry Potter" }>Book 1</InlineLink>
      <InlineLink href={ currentPath + "Eloquent JavaScript" }>Book 2</InlineLink>
      <InlineLink href={ currentPath + "Atomic Habit" } prefetch={ false }>Book 3 (No prefetch)</InlineLink>
      <InlineLink href={ currentPath + "Hitchhiker's Guide to the Galaxy" } useAnchor>Book 4 (No caching)</InlineLink>
    </nav>
    { p.children }
  </>
}