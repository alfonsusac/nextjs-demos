import rehypePrism from '@mapbox/rehype-prism'
import createMDX from '@next/mdx'
import remotePatterns from './remotePattern.mjs'
import withPlaiceholder from '@plaiceholder/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: remotePatterns
  },
  experimental: {
    serverActions:true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });
    config.module.rules.push({
      test: /\.txt/,
      use: 'raw-loader',
    })
    return config
  },
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

export default withPlaiceholder(withMDX(nextConfig))