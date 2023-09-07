import { ImageResponse } from "next/server"
import { getPageDetails } from "./page"
import { NotionIcon } from "@/components/notion/rsc/images"
import Link from "next/link"
import { NotionRichText } from "@/components/notion/rsc/rich-texts/parser"
import { flattenRichText } from "@/components/notion/rsc/rich-texts/utils"
import { readFile } from "fs/promises"
import { resolve } from "path"

// Image metadata
export const alt = 'Next.js Tricks'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function OpenGraphImage_ArticlePages({ params }: { params: { slug: string } }) {
  console.log("GENERATING OG IMAGE")

  const interSemiBold = readFile(resolve('./public/inter/Inter-SemiBold.ttf'))


  // const interSemiBold = fetch(
  //   new URL('/inter/Inter-SemiBold.ttf', import.meta.url)
  // ).then((res) => res.arrayBuffer())

  const { article } = await getPageDetails(params.slug)

  return new ImageResponse(
    // (
    //   // ImageResponse JSX element
    //   <div
    //     style={ {
    //       fontSize: 128,
    //       background: 'white',
    //       width: '100%',
    //       height: '100%',
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //     } }
    //   >
    //     About Acme
    //     { article.id }
    //   </div>
    // ),
    (
      <div style={ {
        background: 'black',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: '0.2rem',
        marginBlock: '2rem',
        padding: '4rem',
        paddingLeft: '6rem',
        alignItems: 'flex-start',
        letterSpacing: '-0.5px',
      } }
        className="my-8 mt-8 space-y-2 relative"
      >
        <NotionIcon icon={ article.icon }
          className="text-5xl m-0 block w-12 h-12 mb-4"
        />
        <div style={ {
          fontSize: '2rem',
          lineHeight: '1.25rem',
          padding: '1rem',
          borderRadius: '0.375rem',
          color: 'rgb(161 161 170)',
          backgroundColor: 'rgb(24 24 27)',
          textDecorationColor: '#52525b',
          textUnderlineOffset: '4px',
          marginLeft: '-0.5rem'/* -8px */,
          marginRight: '-0.5rem'/* -8px */,
        } }
        >
          /articles
        </div>
        <h1
          style={ {
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'font-semibold'
          }}
        >
          { flattenRichText(article.title) }
        </h1>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter', data: await interSemiBold, weight: 400,
        },
      ],
    }
  )

}