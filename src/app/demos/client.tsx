'use client'
import { usePathname } from 'next/navigation'
import { titleCase } from 'title-case'


export function Header() {
  let title = usePathname()?.split('/').at(2)?.replace(/[0-9]-/, '')
  if (!title) return <></>

  return (
    <header className="pt-4 pb-4">
      <h1>{ titleCase(title.replaceAll('-', ' ')) }</h1>
    </header>
  )
}