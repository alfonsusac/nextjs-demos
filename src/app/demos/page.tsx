import { cn } from "@/components/typography"
import { Category, dirs } from "../layout"
import Link from 'next/link'
import { IconParkSolidBrowser } from "../page"
import { slug } from "github-slugger"

export default function Demos() {
  return (
    <div className={ cn(
      "mx-auto mt-4",
      "prose-hr:my-4",
      "prose-h2:mb-4",
      "prose-h2:text-center",

      "prose-h4:leading-8",
      "prose-h4:mt-8",

      "prose-h4:text-zinc-300"
    ) }>
      <h1>
        All Demos
      </h1>

      {/* <hr /> */}
      { dirs.map(category =>
        <>
          <h4 className="pl-2">
            { category.name }
          </h4>

          <div className='flex flex-col'>

            { category.topics.map(page =>
              <Link
                key={ page.title }
                className={ cn(
                  "p-1.5 px-4 rounded-md",
                  "cursor-pointer",
                  // "outline outline-1 outline-zinc-800",
                  "underline decoration-zinc-700",
                  // "shadow-[0px_0px_200px_80px_#ffffff22]",

                  "hover:bg-zinc-900 hover:text-white"
                ) }

                href={ `/demos/${slug(category.name)}/${slug(page.title)}` }
              >
                <IconParkSolidBrowser className="inline text-base mr-3 mb-1" />
                { page.title }
              </Link>
            ) }
          </div>
        </>
      ) }
    </div>
  )
}