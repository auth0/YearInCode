const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE_BUNDLE === 'true',
})

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
        : [process.env.NEXT_PUBLIC_CLOUDFRONT_URL],
  },
})
