# devrel-nebula

An experience for developers to see their career in space/time.

## Development

### Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Java](https://openjdk.java.net/install/index.html)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)

## Configuring Auth0

1. Go to the [Auth0 dashboard](https://manage.auth0.com/) and create a new
   application of type _Regular Web Applications_ and make sure to configure the
   following
2. Go to the settings page of the application
3. Configure the following settings:

- _Allowed Callback URLs_: Should be set to `http://localhost:3000/api/callback`
  when testing locally or typically to `https://myapp.com/api/callback` when
  deploying your application.
- _Allowed Logout URLs_: Should be set to `http://localhost:3000/` when testing
  locally or typically to `https://myapp.com/` when deploying your application.

4. Save the settings
5. Head into _APIs_, and click on _Auth0 Management API_
6. Click on _Machine to Machine Applications_ and authorize your newly created application.
7. Open the authorized application dropdown and select the following permissions: `read:users` and `read:user_idp_tokens`.
8. Save the settings by clicking on update.

## Setting up Auth0 OAuth

1. Go to `Connections -> Social` in your [Auth0 dashboard](https://manage.auth0.com/).
2. Click on _create connection_  and select GitHub.
3. Go back to your connections and click on GitHub.
4. Head into [Auth0 documentation](https://auth0.com/docs/connections/social/github) on how to get your `Client ID` and `Client Secret`.
5. Fill the `Client ID` and `Client Secret`.
6. Enable the `Email address` attribute.
7. Save your settings.
8. Head into _Applications tab_  and authorize your created application.
9. Head into your application in _Applications_ and click on _Connections_.
10. Disable `Username-Password-Authentication` and enable only `GitHub`.

### Set up environment variables

Copy the `.env.local.sample` file in this directory to `.env.local` (which will
be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then, open `.env.local` and add the missing environment variables:

- `NEXT_PUBLIC_AUTH0_DOMAIN` - Can be found in the Auth0 dashboard under
  `settings`.
- `NEXT_PUBLIC_AUTH0_CLIENT_ID` - Can be found in the Auth0 dashboard under
  `settings`.
- `AUTH0_CLIENT_SECRET` - Can be found in the Auth0 dashboard under `settings`.
- `NEXT_PUBLIC_REDIRECT_URI` - The url where Auth0 redirects back to, make sure
  a consistent url is used here.
- `NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI` - Where to redirect after logging out
- `SESSION_COOKIE_SECRET` - A unique secret used to encrypt the cookies, has to
  be at least 32 characters. You can use
  [this generator](https://generate-secret.now.sh/32) to generate a value. Value
  is in seconds.
- `WEBSOCKET_PAYLOAD_SECRET` - A unique secret used to encrypt the websocket
  payload, has to be at least 32 characters. You can use
  [this generator](https://generate-secret.now.sh/32) to generate a value.
- `SESSION_COOKIE_LIFETIME` - How long a session lasts in seconds. The default
  is 2 hours.
- `NEXT_PUBLIC_API_URL` - The url of Next.js serverless functions
- `NEXT_PUBLIC_API_WEBSOCKET_URL` - The url for websocket API in AWS.
- `NEXT_PUBLIC_CLOUDFRONT_URL` - AWS Cloudfront url
- `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_ID`: The token for Cloudflare analytics that can be retrieved from the [dashboard](https://dash.cloudflare.com).
- `LAMBDA_API_URL` - AWS API Gateway url
- `JWKS_URI` - The url for Auth0 public keys. Normally has the following
  structure `https://your-tenant.auth0.com/.well-known/jwks.json`
- `JWT_TOKEN_ISSUER` - The Auth0 tenant. Normally has the following structure
  `https://your-tenant.auth0.com/`
- `AWS_SOURCE_EMAIL` - Email address where local emails will be sent from. Make
  sure to verify the email in the AWS SES dashboard.
- `NEXT_PUBLIC_FACEBOOK_ID` - Facebook APP ID. You can get it
  [here](https://developers.facebook.com/docs/development/create-an-app).
- `AUTH0_AUDIENCE` - The url for Auth0 audience. Normally has the following structure `https://your-tenant.auth0.com/api/v2/`


### Set Up Serveless Offline

To use Serverless Pro, please login with the following command:

```bash
serverless login
```

#### Create Credentials Profiles

To learn how to create profiles in AWS please refer to this
[guide](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).

Nebula has the following profiles for each stage:

- `nebulaDev`
- `nebulaStaging`
- `nebulaProduction`

### Select profile for deployment or development

To switch between profiles use the following command:

```bash
export AWS_PROFILE="nebulaDev"
```

### Development

In the development environment the following servers are run:

- Next.js dev server on port `3000`
- Serverless Offline on port `1337`
- Serverless Offline SES on port `9001`
- Serverless Offline S3 on port `4569`
- DynamoDB on port `8000`
- elasticmq on port `9324`

To run all of these servers concurrently, run the dev command.

```
yarn dev
# or
npm run dev
```

## Deploy on Vercel

You can deploy this app to the cloud with
[Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example)
([Documentation](https://nextjs.org/docs/deployment)).

**Important**: When you import your project on Vercel, make sure to click on
**Environment Variables** and set them to match your `.env.local` file.

## Deploy on AWS

To deploy on AWS please set up the following environment variables in the
Parameter Store:

| Name                              | Value                                                                                                 | Encrypted |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | --------- |
| /{stage}/auth0/audience           | Same as `AUTH0_AUDIENCE`                                                                              |           |
| /{stage}/auth0/client_id          | Same as `NEXT_PUBLIC_AUTH0_CLIENT_ID`                                                                 |           |
| /{stage}/auth0/client_secret      | Same as `AUTH0_CLIENT_SECRET`                                                                         | true      |
| /{stage}/auth0/domain             | Same as `NEXT_PUBLIC_AUTH0_DOMAIN`                                                                    |           |
| /{stage}/jwt/jwks_uri             | Same as `JWKS_URI`                                                                                    |           |
| /{stage}/jwt/token_issuer         | Same as `JWT_TOKEN_ISSUER`                                                                            |           |
| /{stage}/websocket/payload_secret | Same as `WEBSOCKET_PAYLOAD_SECRET`                                                                    | true      |
| /{stage}/site/url                 | Same as `NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI`                                                        |           |
| /{stage}/ses/source_email         | Email address where emails will be sent from. Make sure to verify the email in the AWS SES dashboard. |           |

### Manual Deployment

> Before manually deploying, please make sure to have the correct profile
> selected.

To deploy to dev environment please run the following command:

```bash
serverless deploy
```

To deploy to other stages run:

```bash
serverless deploy --stage staging
# or
serverless deploy --stage prod
```

To deploy a single function run:

```
serverless deploy --stage stage -f functionName
```

## Testing GitHub Actions

To run GitHub Actions locally please install
[act runner](https://github.com/nektos/act).

Then, add this action to the `integration-and-e2e-test` steps:

```
  - name: Install Cypress dependencies
    run:
      apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev
      libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

finally, run the following command:

```
act -P ubuntu-latest=nektos/act-environments-ubuntu:18.04
```

⚠️ `WARNING: this will run a Docker container with >18 GB file size`

A lean build can be run, but Cypress has to be excluded. Like this:

```
act --job unit-test
```
