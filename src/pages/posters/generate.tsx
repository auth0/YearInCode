import React from 'react'
import useWebSocket, {ReadyState} from 'react-use-websocket'
import * as Iron from '@hapi/iron'
import nProgress from 'nprogress'

import {auth0} from '@lib/auth'
import {createLoginUrl} from '@lib/common'
import {Layout, LoadingView, SelectYearsView} from '@components/poster'
import {PosterSteps} from '@nebula/types/poster'
import {PosterService} from '@lib/poster/poster-service'
import {Year} from '@nebula/types/queue'

interface Props {
  wsPayload: string
  currentStep: PosterSteps | ''
  completedYears: Year[]
}

export default function Loading({
  completedYears,
  wsPayload,
  currentStep,
}: Props) {
  const [step, setStep] = React.useState(currentStep)
  const [posterSlug, setPosterSlug] = React.useState('')

  const {readyState, lastJsonMessage} = useWebSocket(
    process.env.NEXT_PUBLIC_API_WEBSOCKET_URL,
    {
      queryParams: {
        wsPayload,
      },
      onOpen: () => {
        nProgress.done()
      },
      onError: () => {
        nProgress.done()
      },
    },
  )
  const isConnecting =
    readyState === ReadyState.CONNECTING ||
    readyState === ReadyState.UNINSTANTIATED

  const isDisconnected =
    readyState === ReadyState.CLOSED || readyState === ReadyState.CLOSING

  React.useEffect(() => {
    if (lastJsonMessage) {
      const {step, posterSlug} = lastJsonMessage as {
        step: PosterSteps
        posterSlug: string
      }

      setStep(step)
      setPosterSlug(posterSlug)
    }
  }, [lastJsonMessage])

  if (isConnecting && step) {
    typeof window !== 'undefined' && nProgress.start()

    return <span className="sr-only">Connecting to Websocket</span>
  }

  if (step) {
    return (
      <LoadingView
        step={step}
        wsDisconnected={isDisconnected}
        posterSlug={posterSlug}
      />
    )
  }

  return <SelectYearsView completedYears={completedYears} setStep={setStep} />
}

export async function getServerSideProps({req, res, query}) {
  const session = await auth0.getSession(req)

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: createLoginUrl('/posters/generate'),
    })
    res.end()

    return {props: {}}
  }

  const tokenCache = auth0.tokenCache(req, res)
  const {accessToken} = await tokenCache.getAccessToken()

  const getPostersPromise = PosterService.getPosters(
    session.user.sub as string,
    accessToken,
  )
  const wsPayloadPromise = Iron.seal(
    {accessToken, userId: session.user.sub},
    process.env.WEBSOCKET_PAYLOAD_SECRET,
    Iron.defaults,
  )

  const {posters} = await getPostersPromise
  const wsPayload = await wsPayloadPromise

  const posterInQueue = posters.find(({step}) => step !== PosterSteps.READY)

  if (
    (!query.new && !posterInQueue && posters.length > 0) ||
    posters.length === 4
  ) {
    res.writeHead(302, {
      Location: `/posters/${posters[0].posterSlug}`,
    })
    res.end()

    return {props: {}}
  }

  const years = posters.map(({year}) => year)

  return {
    props: {
      wsPayload,
      currentStep: posterInQueue?.step ?? '',
      completedYears: years,
    },
  }
}

Loading.Layout = Layout
