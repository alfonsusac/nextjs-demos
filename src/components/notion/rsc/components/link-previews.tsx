import { getMetaInfo } from "@/components/metadata/util"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { cn } from "@/components/typography"
import Image from "next/image"
import { CaptionNode } from "./common"

export async function LinkBookmark({
  className,
  node,
}: NotionComponentProp<'bookmark'>) {

  console.log("LinkBookmark Async")

  const metadata = await getMetaInfo(node.props.url)

  return (
    <div className="my-2">
      <a
        target="_blank"
        href={ node.props.url }
        className={ cn(className,
          "w-full",
          "flex flex-row",
          "rounded-md border",
          "border-zinc-800",
          "no-underline",
          "hover:bg-zinc-900/70"
        ) }
        // Todo: Can we remove the div below?
      >
        <div className="p-3 w-full flex flex-col">

          
          <div className="text-zinc-200 truncate w-full">
            { metadata.title }
          </div>

          
          { // DESCRIPTION
            metadata.description ? (
              <div className={ cn(
                "text-sm text-zinc-400",
                "mt-1 mb-2 h-10 w-full",
                "line-clamp-2"
              ) }>
                { metadata.description }
              </div>
            ) : null
          }

          
          {/* FOOTER */ }
          <div className="text-sm text-zinc-500 flex flex-row gap-2">

            {
              metadata.faviconpath ? (
                <div className="flex items-center">
                  <Image
                    unoptimized
                    width="16"
                    height="16"
                    src={ metadata.faviconpath }
                    alt="Link Icon URL"
                    className="w-4 h-4"
                  />
                </div>
              ) : null
            }

            <div /* LINK */ >
              { metadata.url ? metadata.url.host : node.props.url }
            </div>

            
          </div>

          
        </div>
      </a>
      <CaptionNode node={node} />
    </div>
  )




}