export default function ArticleListLayout(p:{children: React.ReactNode}) {
  return (
    <div className="mx-auto mt-24   max-w-article   prose-hr:my-8   prose-h1:text-5xl  flex flex-col gap-12">

      <header>
        <h1>Articles</h1>
        <p>Articles that I wrote related to Next.js</p>
      </header>

      { p.children }

    </div>
  )
}