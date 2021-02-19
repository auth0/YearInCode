import React from 'react'

import PosterSVG from '@components/poster/Poster/PosterSvg'
import {Poster} from '@nebula/types/poster'

import Wrapper from '../Wrapper'
import Branding from '../Branding'

interface VerticalCardPosterProps {
  data: Poster
}

const VerticalCardPoster: React.FC<VerticalCardPosterProps> = ({data}) => {
  return (
    <Wrapper bodyStyle={{minHeight: '100vh', width: '100vw'}}>
      <Branding
        width={160}
        height={56}
        style={{position: 'absolute', top: '5%'}}
      />

      <PosterSVG data={data} width={500} height={500} />
    </Wrapper>
  )
}

export default VerticalCardPoster
