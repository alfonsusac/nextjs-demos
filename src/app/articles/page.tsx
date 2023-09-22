import { memoize } from "nextjs-better-unstable-cache"


export default function ArticleListPage() {
  return (
    <section className={"mx-auto mt-24 max-w-article flex flex-col gap-12 prose-hr:my-8 prose-h1:text-5xl"}>
      <header>
        <h1>Articles</h1>
        <p>Articles that I wrote related to Next.js</p>
      </header>
      <ArticleList/>
    </section>
  )

}

function ArticleList() {
  const list = await memoize()()
  
  return (

  )
}
export const getArticleList = memoize(getArticleList, {revalidateTags: ['articles']})