import { ImageResponse } from "next/server"
import { getPageDetails } from "./page"
import { flattenRichText } from "@/components/notion/rsc/rich-texts/utils"
import { readFile } from "fs/promises"
import { resolve } from "path"
import { CalloutBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { cn } from "@/components/typography"
import bg from "./opengraph-image-bg.png"
import bgtxt from "./opengraph-image-bg.txt"

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

  const { article } = await getPageDetails(params.slug)

  const icon = article.icon as CalloutBlockObjectResponse['callout']['icon']

  return new ImageResponse(
    (

      <div style={ {
        background: 'black',
        width: '100%',
        height: '100%',
        display: 'flex',
        color: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: '0.2rem',
        marginBlock: '2rem',
        padding: '4rem',
        paddingLeft: '6rem',
        alignItems: 'flex-start',
        letterSpacing: '-0.5px',
      } }
      >
        <div style={ {
          position: 'absolute',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
          zIndex: '-5',
          display: 'flex',
        } }>
          {
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img src={ bgtxt } width={ bg.width } height={ bg.height } />
          }
        </div>

        {
          icon?.type === 'emoji' ? (
            <div tw={ cn('text-5xl m-0 block mb-6 flex') }>
              <span
                style={ {
                  fontSize: '8rem'
                } }
              >
                { icon.emoji }
              </span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
              tw={ cn("block w-24 h-24 rounded-lg mb-4") }
              src={
                icon?.type === 'external' ? icon.external.url :
                  icon?.type === 'file' ? icon.file.url : undefined
              }
            />
          )
        }
        <div style={ {
          fontSize: '2rem',
          lineHeight: '1.25rem',
          padding: '1rem',
          borderRadius: '0.375rem',
          color: 'rgb(161 161 170)',
          backgroundColor: 'rgba(255 255 255 0.08)',
          textDecorationColor: '#52525b',
          textUnderlineOffset: '4px',
          marginLeft: '-0.5rem',
          marginRight: '-0.5rem',
        } }
        >
          /articles
        </div>
        <h1 tw="text-white text-5xl font-semibold leading-tight">
          { flattenRichText(article.title) }
        </h1>
        <div style={ { display: 'flex' } }>
          <div tw='text-2xl opacity-60 flex flex-row'>
            <div>Alfonsus Ardani</div><div tw="mx-4 opacity-40">|</div><div tw="opacity-60">nextjs-tricks.vercel.app</div>
          </div>
        </div>
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
        }
      ],
      emoji: 'fluent'
    }
  )

}
