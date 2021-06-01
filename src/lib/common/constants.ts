const constants = {
  site: {
    url: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
    cloudfront_url: process.env.NEXT_PUBLIC_CLOUDFRONT_URL,
    facebook_id: process.env.NEXT_PUBLIC_FACEBOOK_ID,
    cloudflareAnalyticsId: process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_ID,
    githubRepoUrl: 'https://github.com/auth0/devrel-nebula',
    instagramUrl: 'https://www.instagram.com/weareauth0',
    linkedInUrl: 'https://www.linkedin.com/company/auth0',
    twitterUrl: 'https://twitter.com/auth0',
  },
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
    lambdaUrl: process.env.LAMBDA_API_URL,
  },
  poster: {
    maxExtraPosters: 3,
    maxPosters: 4,
  },
}

export default constants
