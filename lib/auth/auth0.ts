import {initAuth0} from '@auth0/nextjs-auth0'

function getServerSetting(environmentVariable: string, defaultValue?: string) {
  if (typeof window === 'undefined') {
    return process.env[environmentVariable]
  }

  return defaultValue || null
}

export default initAuth0({
  clientId: getServerSetting('NEXT_PUBLIC_AUTH0_CLIENT_ID'),
  clientSecret: getServerSetting('AUTH0_CLIENT_SECRET'),
  scope: getServerSetting('NEXT_PUBLIC_AUTH0_SCOPE', 'openid profile'),
  domain: getServerSetting('NEXT_PUBLIC_AUTH0_DOMAIN'),
  redirectUri: getServerSetting(
    'NEXT_PUBLIC_REDIRECT_URI',
    'http://localhost:3000/api/callback',
  ),
  postLogoutRedirectUri: getServerSetting(
    'NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI',
    'http://localhost:3000/',
  ),
  session: {
    cookieSecret: getServerSetting('SESSION_COOKIE_SECRET'),
    cookieLifetime: Number(process.env.SESSION_COOKIE_LIFETIME) || 7200,
  },
})
