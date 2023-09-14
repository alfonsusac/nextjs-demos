import { getMetaInfo } from "@/components/metadata/util"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { cn } from "@/components/typography"
import Image from "next/image"
import { CaptionNode } from "./common"
import { Audit } from "@/components/timer"
import Link from "next/link"

export async function LinkBookmark(P: {
  url: string,
  title?: string,
  description?: string,
  faviconpath?: string,
  thumbnail?:string,
  className?: string
  variant?: "1" | "2"
}) {
  const { variant = "1" } = P
  const metadata = !P.title ? await getMetaInfo(P.url) : {
    title: P.title,
    description: P.description,
    faviconpath: P.faviconpath,
    url: P.url
  } 
  return (
    <Link
      target="_blank"
      href={ P.url }
      className={ cn(P.className,
        "w-full",
        "flex flex-row items-stretch",
        "border",
        "border-zinc-800",
        "no-underline",
        "group relative overflow-hidden transition-all",

        "border-zinc-900",
        "rounded-lg",
        "bg-gradient-to-bl from-zinc-950 shadow-inner",

        "duration-300",
        "hover:border-zinc-800",
      ) }
    >
      <div className="hidden group-hover:block absolute w-full h-full group-hover:bg-zinc-600/10 transition-all bg-gradient- from-zinc-600/20" />
      {/* LEFT */}
      <div className="p-4 w-full">
        <div className="text-zinc-200 truncate w-full">
          { metadata.title }<span className="">
            <svg className="inline align-text-top text-zinc-400 " xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h10m0 0v10m0-10L7 17"></path></svg>
          </span>
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
            { metadata.url ? (new URL(metadata.url)).host : P.url }
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-64">
        <img
          src="https://nextjs.org/api/og?title=Docs"
          alt={ `URL to ${metadata.title}` }
          className="h-full object-cover"
        />
      </div>
    </Link>
  )
}

export async function NotionLinkBookmark({
  className,
  node,
}: NotionComponentProp<'bookmark'>) {

  // console.log("LinkBookmark Async")
  const audit = new Audit('', false)
  const metadata = await getMetaInfo(node.props.url)
  audit.mark('Link Bookmark Component')

  return (
    <div className="my-2">
      <LinkBookmark url={ node.props.url } className={ className } />
      <CaptionNode node={ node } />
    </div>
  )




}