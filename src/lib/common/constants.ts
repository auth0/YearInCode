const constants = {
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
    lambdaUrl: process.env.LAMBDA_API_URL,
  },
}

export default constants
