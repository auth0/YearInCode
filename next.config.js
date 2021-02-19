const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE_BUNDLE === 'true',
})

function getDomain(val) {
  return val.replace('https://', '')
}

module.exports = withBundleAnalyzer({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    domains:
      process.env.NODE_ENV === 'development'
        ? ['localhost']
        : [getDomain(process.env.NEXT_PUBLIC_CLOUDFRONT_URL) || ''],
  },
})
