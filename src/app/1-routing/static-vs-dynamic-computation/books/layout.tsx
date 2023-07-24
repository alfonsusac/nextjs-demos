import Link from "next/link"
import { InlineLink } from "@/components/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/books/'

export default function Layout(p: { children: React.ReactNode }) {
  return <>
    <h1>📚 Books</h1>
    <p>
      This page shows how dynamic routing converts route into dynamically rendered route
    </p>
    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "Harry Potter" }>Harry Potter</InlineLink>
      <InlineLink href={ currentPath + "Eloquent JavaScript" }>Eloquent JavaScript</InlineLink>
      <InlineLink href={ currentPath + "Atomic Habit" }>Atomic Habit</InlineLink>
    </nav>
    { p.children }
  </>
}