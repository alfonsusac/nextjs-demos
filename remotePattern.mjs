/** @type { import('next/dist/shared/lib/image-config').ImageConfigComplete['remotePatterns'] } */
const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
  }, {
    protocol: 'https',
    hostname: '**.amazonaws.com',
    pathname: '/secure.notion-static.com/**'
  }, {
    hostname: 'images.unsplash.com'
  }
]
    


export default remotePatterns