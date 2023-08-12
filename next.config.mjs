import rehypePrism from '@mapbox/rehype-prism'
import createMDX from '@next/mdx'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      }, {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/secure.notion-static.com/**'
      }
    ]
  },
  // compiler: {
  //   removeConsole: {
  //     exclude: ['info', 'error']
  //   }
  // },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });

    return config
  }
  
}

const withMDX = createMDX({
  options: {
    extension: /\.mdx?$/,
    remarkPlugins: [],
    rehypePlugins: [rehypePrism],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

export default withMDX(nextConfig)