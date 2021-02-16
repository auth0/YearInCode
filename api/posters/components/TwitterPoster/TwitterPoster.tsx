import React from 'react'

import {separateNumber} from '@components/poster/Poster/Poster.utils'
import PosterSVG from '@components/poster/Poster/PosterSvg'
import {Poster} from '@nebula/types/poster'

import Wrapper from '../Wrapper'
import Branding from '../Branding'

import InfoBox from './InfoBox'

interface TwitterPosterProps {
  data: Poster
}

const TwitterPoster: React.FC<TwitterPosterProps> = ({data}) => {
  return (
    <Wrapper
      bodyStyle={{flexDirection: 'row', justifyContent: 'space-between'}}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem 1rem 1rem 2.5rem',
          alignSelf: 'flex-start',
          minHeight: '100vh',
          width: '46vw',
        }}
      >
        <Branding style={{marginLeft: '-0.8rem'}} width={233} height={82} />

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}>
          <InfoBox label="Name" value={data.name} />
          <InfoBox label="#1 Language" value={data.dominantLanguage} />

          <InfoBox label="Followers" value={data.followers.toString()} />
          <InfoBox label="#1 Repo" value={data.dominantRepository} />

          <InfoBox label="Year" value={data.year.toString()} />
          <InfoBox
            label="Lines of Code"
            value={separateNumber(data.totalLinesOfCode)}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '1rem',
          transform: 'scale(1.1)',
        }}
      >
        <PosterSVG data={data} width={550} height={550} />
      </div>
    </Wrapper>
  )
}

export default TwitterPoster
