import React from 'react'

import PosterSVG from '@components/poster/Poster/PosterSvg'
import {Poster} from '@nebula/types/poster'
import {separateNumber} from '@components/poster/Poster/Poster.utils'

import Wrapper from '../Wrapper'
import Branding from '../Branding'

import InfoCol from './InfoCol'

interface HighQualityPosterProps {
  data: Poster
}

const HighQualityPoster: React.FC<HighQualityPosterProps> = ({data}) => {
  return (
    <Wrapper bodyStyle={{minHeight: '100vh', width: '100vw'}}>
      <PosterSVG
        data={data}
        width={1400}
        height={2400}
        sittingPersonWidth={81.66}
        sittingPersonHeight={133.09}
      />

      <Branding
        width={323}
        height={113.62}
        style={{position: 'absolute', top: '5%'}}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          width: '100%',
          position: 'absolute',
          bottom: '5%',
          padding: '0 2.7rem 0 1rem',
        }}
      >
        <InfoCol label="Name" value={data.name} />
        <InfoCol label="Followers" value={data.followers.toString()} />
        <InfoCol label="Year" value={data.year.toString()} />
        <InfoCol
          label="Lines of Code"
          value={separateNumber(data.totalLinesOfCode)}
        />
        <InfoCol label="#1 Repo" value={data.dominantRepository} />
        <InfoCol label="#1 Language" value={data.dominantLanguage} />
      </div>
    </Wrapper>
  )
}

export default HighQualityPoster
