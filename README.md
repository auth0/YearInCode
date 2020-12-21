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

### Set up environment variables

To connect the app with Auth0, you'll need to add the settings from your Auth0
application as environment variables

Copy the `.env.local.example` file in this directory to `.env.local` (which will
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
  [this generator](https://generate-secret.now.sh/32) to generate a value.
- `SESSION_COOKIE_LIFETIME` - How long a session lasts in seconds. The default
  is 2 hours.

## Deploy on Vercel

You can deploy this app to the cloud with
[Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example)
([Documentation](https://nextjs.org/docs/deployment)).

**Important**: When you import your project on Vercel, make sure to click on
**Environment Variables** and set them to match your `.env.local` file.

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
