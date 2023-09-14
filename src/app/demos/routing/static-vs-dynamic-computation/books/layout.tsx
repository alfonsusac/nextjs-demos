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
      <span className="text-slate-600 m-0">|</span>
      <InlineLink href={ currentPath + "Harry Potter" } useAnchor>Book 1</InlineLink>
      <InlineLink href={ currentPath + "Eloquent JavaScript" } useAnchor>Book 2</InlineLink>
      <InlineLink href={ currentPath + "Atomic Habit" } useAnchor>Book 3 </InlineLink>
      <InlineLink href={ currentPath + "Hitchhiker's Guide to the Galaxy" } useAnchor>Book 4 </InlineLink>
    </nav>
    { p.children }
  </>
}