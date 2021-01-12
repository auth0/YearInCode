import React from 'react'
import useWebSocket, {ReadyState} from 'react-use-websocket'
import * as Iron from '@hapi/iron'

import {auth0, UserProfile} from '@lib/auth'
import {createLoginUrl} from '@lib/common'
import {Layout, LoadingView, SelectYearsView} from '@components/death-star'
import {DeathStarSteps} from '@nebula/types/death-star'
import {DeathStarService} from '@lib/death-star/death-star-service'
interface Props {
  user: UserProfile
  sealedAccessToken: string
  currentStep: DeathStarSteps | ''
}

export default function Loading({user, sealedAccessToken, currentStep}: Props) {
  const [step, setStep] = React.useState(currentStep)
  const {readyState, lastJsonMessage} = useWebSocket(
    process.env.NEXT_PUBLIC_API_WEBSOCKET_URL,
    {
      queryParams: {
        userId: user.sub,
        accessToken: sealedAccessToken,
      },
      retryOnError: true,
    },
  )
  const isConnecting =
    readyState === ReadyState.CONNECTING ||
    readyState === ReadyState.UNINSTANTIATED
  const isDisconnected = readyState === ReadyState.CLOSED

  React.useEffect(() => {
    if (lastJsonMessage) {
      const {step} = lastJsonMessage as {step: DeathStarSteps}

      setStep(step)
    }
  }, [lastJsonMessage])

  if (isConnecting && currentStep) {
    return <span className="sr-only">Connecting to Websocket</span>
  }

  if (step) {
    return <LoadingView step={step} wsDisconnected={isDisconnected} />
  }

  return <SelectYearsView setStep={setStep} />
}

export async function getServerSideProps({req, res}) {
  const session = await auth0.getSession(req)

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: createLoginUrl('/death-star'),
    })
    res.end()

    return {props: {}}
  }

  const tokenCache = auth0.tokenCache(req, res)
  const {accessToken} = await tokenCache.getAccessToken()

  const getStatusPromise = DeathStarService.getStatus(
    session.user.sub as string,
    accessToken,
  )
  const sealedAccessTokenPromise = Iron.seal(
    accessToken,
    process.env.SESSION_ACCESS_TOKEN_SECRET,
    Iron.defaults,
  )

  const {status} = await getStatusPromise
  const sealedAccessToken = await sealedAccessTokenPromise

  return {
    props: {
      user: session.user,
      sealedAccessToken,
      currentStep: status?.step ?? '',
    },
  }
}

Loading.Layout = Layout
