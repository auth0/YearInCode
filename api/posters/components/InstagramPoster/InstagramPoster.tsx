import React from 'react'

import {separateNumber} from '@components/poster/Poster/Poster.utils'
import PosterSVG from '@components/poster/Poster/PosterSvg'
import {Poster} from '@nebula/types/poster'

import Wrapper from '../Wrapper'
import Branding from '../Branding'

import InfoCol from './InfoCol'

interface InstagramPosterProps {
  data: Poster
}

const InstagramPoster: React.FC<InstagramPosterProps> = ({data}) => {
  return (
    <Wrapper bodyStyle={{height: '100vh'}}>
      <Branding
        width={200}
        height={80}
        style={{position: 'absolute', top: '2%'}}
      />

      <div style={{marginTop: '4rem'}}>
        <PosterSVG data={data} width={900} height={900} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: '0',
          width: 1080,
          height: 800,
          background: 'linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 70%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          position: 'absolute',
          bottom: '5%',
          padding: '0 7rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            marginBottom: '2rem',
            justifyContent: 'center',
          }}
        >
          <InfoCol label="Name" value={data.name} />
          <InfoCol label="Followers" value={data.followers.toString()} />
          <InfoCol label="Year" value={data.year.toString()} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <InfoCol
            label="Lines of Code"
            value={separateNumber(data.totalLinesOfCode)}
          />
          <InfoCol label="#1 Repo" value={data.dominantRepository} />
          <InfoCol label="#1 Language" value={data.dominantLanguage} />
        </div>
      </div>
    </Wrapper>
  )
}

export default InstagramPoster
