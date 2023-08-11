import * as cheerio from 'cheerio'
import urlMetadata from 'url-metadata'
//@ts-ignore
import parse from 'url-metadata/lib/parse'


export async function getMetaInfo(source: string) {
  try {
    const sourceurl = new URL(source)

    const metadata = await urlMetadata_withFavicon(sourceurl.toString())
    
    return {
      title: metadata['twitter:title'] ? metadata['twitter:title'] :
        metadata['og:title'] ? metadata['og:title'] : 
          metadata['title'] ? metadata['title'] :
            sourceurl.hostname,
      description: metadata['twitter:description'] ? metadata['twitter:description'] :
        metadata['og:description'] ? metadata['og:description'] :
          metadata['description'] ? metadata['description'] : undefined,
      image: metadata['twitter:image'] ? metadata['twitter:image'] :
        metadata['og:image'] ? metadata['og:image'] : undefined
      
    }
  } catch (error) {
    return {
      title: source,
      url: 'source',
    }
  }

  const title = ''
  const description = ''
  const image = ''
  const url = ''
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
      
      return metadata
    })
}