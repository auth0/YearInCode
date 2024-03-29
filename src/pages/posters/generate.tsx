import React from 'react'
import useWebSocket, {ReadyState} from 'react-use-websocket'
import * as Iron from '@hapi/iron'
import nProgress from 'nprogress'
import {GetServerSidePropsContext, NextApiRequest, NextApiResponse} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {auth0} from '@lib/auth'
import {constants, createLoginUrl} from '@lib/common'
import {LoadingView, SelectYearsView} from '@components/poster'
import {PosterSteps} from '@nebula/types/poster'
import {PosterService} from '@lib/poster/poster-service'
import {Year} from '@nebula/types/queue'
import Logo from '@assets/svg/auth0-logo-white.svg'
import {Layout, PosterBackdrop} from '@components/common'

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
  const router = useRouter()
  const [step, setStep] = React.useState(currentStep)
  const [posterSlug, setPosterSlug] = React.useState('')

  const {readyState, lastJsonMessage} = useWebSocket(
    process.env.NEXT_PUBLIC_API_WEBSOCKET_URL as string,
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

      if (step === PosterSteps.FAILED) {
        router.push('/error')
      }
    }
  }, [lastJsonMessage])

  if (isConnecting && step) {
    typeof window !== 'undefined' && nProgress.start()

    return <span className="sr-only">Connecting to Websocket</span>
  }

  return (
    <Layout
      navigation={
        <header className="flex items-center justify-center px-4 pt-8">
          <Link href="/" passHref>
            <a>
              <Logo aria-hidden width={89} height={32} />
              <span className="sr-only">Auth0 Logo</span>
            </a>
          </Link>
        </header>
      }
      content={
        <PosterBackdrop>
          {step ? (
            <LoadingView
              step={step}
              wsDisconnected={isDisconnected}
              posterSlug={posterSlug}
            />
          ) : (
            <SelectYearsView
              completedYears={completedYears}
              setStep={setStep}
            />
          )}
        </PosterBackdrop>
      }
    />
  )
}

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const session = await auth0.getSession(req)

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: createLoginUrl('/posters/generate'),
    })
    res.end()

    return {props: {}}
  }

  const tokenCache = auth0.tokenCache(
    req as NextApiRequest,
    res as NextApiResponse,
  )
  const {accessToken} = await tokenCache.getAccessToken()

  const getPostersPromise = PosterService._getPosters(
    session.user.sub as string,
    accessToken as string,
  )
  const wsPayloadPromise = Iron.seal(
    {accessToken, userId: session.user.sub},
    process.env.WEBSOCKET_PAYLOAD_SECRET as string,
    Iron.defaults,
  )

  const {posters} = await getPostersPromise
  const wsPayload = await wsPayloadPromise

  const posterInQueue = posters.find(({step}) => step !== PosterSteps.READY)

  const hasPosters = posters.length > 0
  const wantsToGenerateNewPoster = query.new
  const canGenerateMorePosters = posters.length !== constants.poster.maxPosters

  const shouldRedirectToPoster =
    (!wantsToGenerateNewPoster && !posterInQueue && hasPosters) ||
    !canGenerateMorePosters

  if (shouldRedirectToPoster) {
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
