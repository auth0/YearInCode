import {initAuth0} from '@auth0/nextjs-auth0'
import {ISignInWithAuth0} from '@auth0/nextjs-auth0/dist/instance'
import IAuth0Settings from '@auth0/nextjs-auth0/dist/settings'

const noop = {} as ISignInWithAuth0

function getServerSetting(environmentVariable: string, defaultValue?: string) {
  if (typeof window === 'undefined') {
    return process.env[environmentVariable] as string
  }
  return defaultValue as string
}

const auth0Config: IAuth0Settings = {
  audience: getServerSetting('AUTH0_AUDIENCE'),
  clientId: getServerSetting('NEXT_PUBLIC_AUTH0_CLIENT_ID'),
  clientSecret: getServerSetting('AUTH0_CLIENT_SECRET'),
  scope: getServerSetting(
    'NEXT_PUBLIC_AUTH0_SCOPE',
    'openid profile offline_access',
  ),
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
    storeAccessToken: true,
    storeRefreshToken: true,
  },
}

const auth0 =
  process.env.CI || process.env.NODE_ENV === 'test'
    ? noop
    : initAuth0(auth0Config)

export default auth0
