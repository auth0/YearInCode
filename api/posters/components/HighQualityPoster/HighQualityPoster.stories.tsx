import * as React from 'react'
import {Meta, Story} from '@storybook/react/types-6-0'

import {getMockData} from '@components/poster/Poster/Poster.utils'

import Wrapper from '../Wrapper'

import HighQualityPoster from './HighQualityPoster'

export default {
  title: 'Back-End/High Quality Poster',
  component: HighQualityPoster,
} as Meta

const Template: Story<Parameters<typeof HighQualityPoster>[0]> = args => (
  <Wrapper>
    <HighQualityPoster {...args} />
  </Wrapper>
)

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
