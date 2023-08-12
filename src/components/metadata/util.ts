import * as cheerio from 'cheerio'
//@ts-ignore
import parse from 'url-metadata/lib/parse'

export async function getMetaInfo(source: string) {
  try {
    const sourceurl = new URL(source)

    const metadata = await urlMetadata_withFavicon(sourceurl.toString(), {
      descriptionLength: 100
    })

    const rawfaviconpath = metadata['fluid-faviconpath'] ? metadata['fluid-faviconpath'] as string :
      metadata['faviconpath'] ? metadata['faviconpath'] as string : undefined

    const faviconpath = rawfaviconpath ? rawfaviconpath.startsWith('/')
      ? sourceurl.origin + rawfaviconpath
      : rawfaviconpath
      : undefined

    return {
      title: metadata['twitter:title'] ? metadata['twitter:title'] as string :
        metadata['og:title'] ? metadata['og:title'] as string :
          metadata['title'] ? metadata['title'] as string :
            metadata['title2'] ? metadata['title2'] as string :
              sourceurl.hostname,
      description: metadata['twitter:description'] ? metadata['twitter:description'] as string :
        metadata['og:description'] ? metadata['og:description'] as string :
          metadata['description'] ? metadata['description'] as string : undefined,
      image: metadata['twitter:image'] ? metadata['twitter:image'] as string :
        metadata['og:image'] ? metadata['og:image'] as string : undefined,
      faviconpath: faviconpath ? faviconpath as string : undefined,
      url: sourceurl,
      raw: metadata
    }
  } catch (error) {
    return {
      title: source,
    }
  }
}


export async function getFileName(url: string) {

  const metadata = await getMetaInfo(url)

  if (metadata.title === url) {
    try {
      metadata.title = new URL(url).pathname.split('/').at(-1) ?? url
    } catch (error) {
      metadata.title = url      
    }
  }
  return metadata

}


function urlMetadata_withFavicon(url: string, options?: any) {
  if (!options || typeof options !== 'object') options = {}

  const opts = Object.assign(
    // defaults
    {
      requestHeaders: {
        'User-Agent': 'url-metadata/3.0 (npm module)',
        From: 'example@example.com'
      },
      cache: 'no-cache',
      mode: 'cors',
      timeout: 10000,
      descriptionLength: 750,
      ensureSecureImageRequest: true,
      includeResponseBody: false
    },
    // options passed in override defaults
    options
  )

  const requestOpts = {
    method: 'GET',
    headers: opts.requestHeaders,
    cache: opts.cache,
    mode: opts.mode,
    timeout: opts.timeout,
    redirect: 'follow'
  }

  return fetch(url, requestOpts as any)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`response code ${response.status}`)
      }

      // rewrite url if our request had to follow redirects to resolve the
      // final link destination (for example: links shortened by bit.ly)
      if (response.url) url = response.url

      const contentType = response.headers.get('content-type')
      const isText = contentType && contentType.startsWith('text')
      const isHTML = contentType && contentType.includes('html')

      if (!isText || !isHTML) {
        throw new Error(`unsupported content type: ${contentType}`)
      }

      return response.text()
    })
    .then((body) => {
      const metadata = parse(url, body, opts) as Record<string, string | boolean | Record<string, string>>

      const $ = cheerio.load(body)
      const faviconpath = $('link[rel=icon]').first().attr('href')
      if (faviconpath) {
        metadata['faviconpath'] = faviconpath
      }
      const fluidFaviconpath = $('link[rel=fluid-icon]').first().attr('href')
      if (fluidFaviconpath) {
        metadata['fluid-faviconpath'] = fluidFaviconpath
      }
      const title2 = $('title').first().text()
      if (title2) {
        metadata['title2'] = title2
      }

      return metadata
    })
}