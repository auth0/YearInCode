import React from 'react'

import PosterSVG from '@components/poster/Poster/PosterSvg'
import {Poster} from '@nebula/types/poster'

import Wrapper from '../Wrapper'
import Branding from '../Branding'

interface OpenGraphPoster {
  data: Poster
}

const OpenGraphPoster: React.FC<OpenGraphPoster> = ({data}) => {
  return (
    <Wrapper>
      <PosterSVG data={data} width={1280} height={680} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: '0',
          width: 1080,
          height: 324,
          background:
            'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)',
          transform: 'rotate(180deg)',
        }}
      >
        <Branding
          width={180}
          height={63}
          style={{transform: 'rotate(180deg)'}}
        />
      </div>
    </Wrapper>
  )
}

export default OpenGraphPoster
