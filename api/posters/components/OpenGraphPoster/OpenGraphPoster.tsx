import React from 'react'

import {separateNumber} from '@components/poster/Poster/Poster.utils'
import PosterSVG from '@components/poster/Poster/PosterSvg'
import {Poster} from '@nebula/types/poster'

import Wrapper from '../Wrapper'
import Branding from '../Branding'

import InfoBox from './InfoBox'

interface OpenGraphPosterProps {
  data: Poster
}

const OpenGraphPoster: React.FC<OpenGraphPosterProps> = ({data}) => {
  return (
    <Wrapper
      bodyStyle={{flexDirection: 'row', justifyContent: 'space-between'}}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem 1rem 1rem 2.5rem',
          alignSelf: 'flex-start',
          minHeight: '100vh',
          width: '38vw',
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
          top: '1.9rem',
          transform: 'scale(1.06)',
        }}
      >
        <PosterSVG data={data} width={750} height={750} />
      </div>
    </Wrapper>
  )
}

export default OpenGraphPoster
