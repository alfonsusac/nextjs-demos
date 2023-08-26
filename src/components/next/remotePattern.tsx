import remotePatterns from "../../../remotePattern.mjs"

export function inRemotePattern(urlstr: string): boolean {

  let url: URL
  try {
    url = new URL(urlstr)
  } catch (error) {
    return false
  }

  const patterns = remotePatterns as any


  if (!patterns) return true

  for (const pattern of patterns) {
    const host = pattern.hostname
    const path = pattern.pathname
    const hostNoStars = host.replaceAll('*', '')

    // Hostname doesn't match
    if (url.hostname.endsWith(hostNoStars) === false) {
      continue
    }

    // Wildcard doesn't match
    if (host.startsWith('**') === false) {
      if (host.startsWith('*') === true &&
        url.host.replace(hostNoStars, '').includes('.')
      ) {
        continue
      }
    }

    if (path) {
      const pathNoStars = path.replaceAll('*', '')

      // Pathname doesn't match
      if (url.pathname.startsWith(pathNoStars) === false) {
        continue
      }

      // Wildcard doesn't match
      if (path.endsWith('**') === false) {
        if (path.endsWith('*') === true &&
          url.host.replace(hostNoStars, '').includes('.')
        ) {
          continue
        }
      }
    }

    if (pattern.port) {
      if (url.port !== pattern.port) {
        continue
      }
    }

    if (pattern.protocol) {
      if (url.protocol.startsWith(pattern.protocol) === false) {
        continue
      }

    }
    return true
  }
  console.log("URL doesn't match any pattern: " + url)
  return false
}
