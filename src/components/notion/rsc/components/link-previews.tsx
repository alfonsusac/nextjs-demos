/* eslint-disable @next/next/no-img-element */
import { getMetaInfo } from "@/components/metadata/util"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { cn } from "@/components/typography"
import { CaptionNode } from "./common"
import { Audit } from "@/components/timer"
import Link from "next/link"
import Image from "next/image"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export async function LinkBookmark(P: {
  loading?: boolean,
  url?: string,
  title?: string,
  description?: string,
  faviconpath?: string,
  thumbnail?: string,
  className?: string
  variant?: "1" | "2"
}) {
  const url = P.url ?? null
  const metadata = !P.title && P.url ? await getMetaInfo(P.url) : {
    title: P.title,
    description: P.description,
    faviconpath: P.faviconpath,
    url: P.url
  }

  function Outer(R: { children: React.ReactNode }) {
    return (
      !P.loading && P.url ? (
        <Link
          target="_blank"
          href={ P.url }
          className={ cn(P.className,
            "w-full h-32",
            "flex flex-row items-stretch",
            "border",
            "no-underline",
            "group relative overflow-hidden transition-all",

            "border-slate-500/10",
            "bg-gradient-to-bl from-slate-950/30 shadow-inner",
            "hover:border-slate-800",

            "rounded-lg",

            "duration-100",
            // "hover:scale-[1.01]",
          ) }
        >
          { R.children }
        </Link>
      ) : (
        <div
          className={ cn(P.className,
            "w-full h-32",
            "flex flex-row items-stretch",
            "border",
            "no-underline",
            "group relative overflow-hidden transition-all",

            "border-slate-500/10",
            "bg-gradient-to-bl from-slate-950/30 shadow-inner",
            "hover:border-slate-800",

            "rounded-lg",

            "duration-100",
          ) }
        >
          { R.children }
        </div>
      )
    )
  }


  return (
    <Outer>
      {/* Hover */ }
      <div className={ cn(
        "opacity-0 absolute  w-full h-full  transition-all duration-150",
        "group-hover:bg-slate-800/50",
        "group-hover:opacity-50"
      ) } />
      {/* LEFT */ }
      <div className="p-4 pt-3">
        <div className={ cn("text-slate-200 truncate w-full h-[1lh]") }>
          {
            P.loading ? (
              <div className="w-36 bg-slate-700/50 rounded-lg  animate-pulse h-[0.7lh]   mt-1 text-transparent">
                Loading...
              </div>
            ) : null
          }
          { metadata.title }
          {
            metadata.url &&
            <svg className="inline align-text-top text-slate-400 " xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h10m0 0v10m0-10L7 17"></path></svg>
          }
        </div>


        <div className={ cn(
          "text-sm text-slate-400",
          "mt-1 mb-2 h-10 w-full",
          "line-clamp-2"
        ) }>
          {
            P.loading ? (
              <div className="w-96 bg-slate-700/50 rounded-lg  animate-pulse h-[0.7lh]   mt-1 text-transparent">
                Loading...
              </div>
            ) : null
          }
          { metadata.description }
        </div>
        {/* FOOTER */ }
        <div className="text-sm text-slate-500 flex flex-row gap-2">
          {
            P.loading ? (
              <div className="w-48 bg-slate-700/50 rounded-lg  animate-pulse h-[0.7lh]   mt-1 text-transparent">
                Loading...
              </div>
            ) : null
          }
          <div className="flex items-center">
            {
              !P.loading && metadata.faviconpath ? (
                <Image
                  unoptimized
                  width="16"
                  height="16"
                  src={ metadata.faviconpath }
                  alt="Link Icon URL"
                  className="w-4 h-4"
                />
              ) : null
            }
          </div>
          <div /* LINK */ >
            { metadata.url ? (new URL(metadata.url)).host : P.url }{ " " }
          </div>
        </div>
      </div>

      {/* RIGHT */ }
      {
        P.thumbnail ? (
          <div className="w-64">
            <img
              src={ P.thumbnail }
              alt={ `URL to ${metadata.title}` }
              className="h-full object-cover"
            />
          </div>
        ) : (
          <></>
        )
      }
    </Outer>
  )
}

export async function NotionLinkBookmark({
  className,
  node,
}: NotionComponentProp<'bookmark'>) {

  // console.log("LinkBookmark Async")
  const audit = new Audit('', false)
  audit.mark('Link Bookmark Component')

  return (
    <div className="my-2">
      <ErrorBoundary fallback={
        <LinkBookmark url="" loading />
      }>
        <Suspense fallback={
          <LinkBookmark url="" loading />
        }>
          <LinkBookmark url={ node.props.url } className={ className } />
        </Suspense>
      </ErrorBoundary>
      <CaptionNode node={ node } />
    </div>
  )




}