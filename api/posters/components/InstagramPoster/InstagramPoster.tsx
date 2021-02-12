import React from 'react'

import PosterSVG from '@components/poster/Poster/PosterSvg'
import {Poster} from '@nebula/types/poster'

import Wrapper from '../Wrapper'
import Branding from '../Branding'

interface InstagramPosterProps {
  data: Poster
}

const InstagramPoster: React.FC<InstagramPosterProps> = ({data}) => {
  return (
    <Wrapper>
      <PosterSVG data={data} width={1080} height={1080} />
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
        <Branding style={{transform: 'rotate(180deg)'}} />
      </div>
    </Wrapper>
  )
}

export default InstagramPoster
