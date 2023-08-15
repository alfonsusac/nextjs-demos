import { Page } from "../client"
import { Category, dirs } from "../layout"

export default function Demos() {
  return (
    <article className="mx-auto">
      <h1>
        Demos
      </h1>
      {/* <hr className="mt-4" /> */}
      { dirs.map(category =>
        <>
          <Category key={ category.name } label={ category.name } />
          { category.topics.map(page =>
            <Page key={ page.title } label={ page.title } category={ `/${category.name}/` } />
          ) }
        </>
      ) }
    </article>
  )
}