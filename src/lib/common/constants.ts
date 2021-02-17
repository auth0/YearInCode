const constants = {
  site: {
    url: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
    cloudfront_url: process.env.NEXT_PUBLIC_CLOUDFRONT_URL,
  },
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
    lambdaUrl: process.env.LAMBDA_API_URL,
  },
}

export default constants
