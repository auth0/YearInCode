const {NEXT_PUBLIC_AUTH0_DOMAIN, NEXT_PUBLIC_API_URL} = process.env

const constants = {
  auth0: {
    domain: NEXT_PUBLIC_AUTH0_DOMAIN,
  },
  api: {
    url: NEXT_PUBLIC_API_URL,
  },
}

export default constants
