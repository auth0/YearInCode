import {NextSeo} from 'next-seo'

import {DownloadPoster, PosterHangingSign} from '@components/poster'
import {PosterService} from '@lib/poster/poster-service'
import {Poster, PosterSlugResponse} from '@nebula/types/poster'
import {logger} from '@nebula/log'
import PosterComponent from '@components/poster/Poster'
import {constants} from '@lib/common'
import {Year} from '@nebula/types/queue'
import {auth0, UserProfile} from '@lib/auth'
import {Footer, Header, Layout, PosterBackdrop} from '@components/common'
import NoGithubActivity from '@components/poster/NoGitHubActivity'

interface PosterBySlugProps {
  year: Year
  posterSlug: string
  posterData: Poster
  posterImages: PosterSlugResponse['posterImages']
  otherPosters: PosterSlugResponse['otherPosters']
  user?: UserProfile
}

export default function PosterBySlug({
  year,
  posterData,
  posterImages,
  posterSlug,
  otherPosters,
  user,
}: PosterBySlugProps) {
  const siteUrl = `${constants.site.url}/posters/${posterSlug}`

  const isUserPoster =
    user?.name.trim() === posterData.name.trim() ||
    user?.nickname.trim() === posterData.name.trim()

  const canGenerateMorePosters =
    otherPosters.length < constants.poster.maxExtraPosters && isUserPoster

  const noPostersActivity = posterData.weeks.length === 0

  if (noPostersActivity && isUserPoster) {
    return (
      <>
        <NextSeo
          title={`${posterData.name}'s ${posterData.year} Year in Code`}
          openGraph={{
            type: 'website',
            description: `Come take a look at the art generated from ${posterData.name}’s code in ${posterData.year}!`,
            images: [
              {
                url: `${constants.site.cloudfront_url}/${posterImages.openGraph}`,
                width: 1280,
                height: 680,
              },
            ],
          }}
          twitter={{
            site: siteUrl,
          }}
        />

        <Layout
          navigation={
            <Header isUserPoster={isUserPoster} isLoggedIn={Boolean(user)} />
          }
          content={
            <PosterBackdrop>
              <NoGithubActivity />
            </PosterBackdrop>
          }
        />
      </>
    )
  }

  return (
    <>
      <NextSeo
        title={`${posterData.name}'s ${posterData.year} Year in Code`}
        openGraph={{
          type: 'website',
          description: `Come take a look at the art generated from ${posterData.name}’s code in ${posterData.year}!`,
          images: [
            {
              url: `${constants.site.cloudfront_url}/${posterImages.openGraph}`,
              width: 1280,
              height: 680,
            },
          ],
        }}
        twitter={{
          site: siteUrl,
        }}
      />

      <Layout
        navigation={
          <Header isUserPoster={isUserPoster} isLoggedIn={Boolean(user)} />
        }
        content={
          <div className="pt-8">
            <PosterHangingSign
              name={posterData.name}
              src={`${constants.site.cloudfront_url}/${posterImages.highQualityPoster}`}
            />
            <DownloadPoster
              year={year}
              isUserPoster={isUserPoster}
              posterData={posterData}
              canGenerateMorePosters={canGenerateMorePosters}
              posterImages={posterImages}
              posterSlug={posterSlug}
              otherPosters={otherPosters}
            />

            <section className="flex flex-col items-center flex-1 px-4 pb-12 overflow-auto">
              <PosterComponent wrapperClassName="mt-12" data={posterData} />
            </section>
          </div>
        }
        footer={<Footer />}
      />
    </>
  )
}

export async function getServerSideProps({params, res, req}) {
  try {
    const {slug} = params

    const session = await auth0.getSession(req)

    const {
      posterData,
      posterImages,
      year,
      otherPosters,
    } = await PosterService._getPosterBySlug(slug)

    return {
      props: {
        year,
        posterSlug: slug,
        posterData: JSON.parse(posterData) as Poster,
        posterImages,
        otherPosters,
        user: session?.user ?? null,
      },
    }
  } catch (err) {
    logger.error(err)

    const e = err.message.split(' ')
    const errorStatus: string = e[e.length - 1]

    if (errorStatus === '404') {
      res.writeHead(302, {
        Location: `/`,
      })

      res.end()

      return {props: {}}
    }
  }
}
