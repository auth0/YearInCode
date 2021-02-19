import * as React from 'react'
import {Meta} from '@storybook/react/types-6-0'

import {getMockData} from '@components/poster/Poster/Poster.utils'

import VerticalCardPoster from './VerticalCardPoster'

export default {
  title: 'Back-End/Vertical Card Poster',
  component: VerticalCardPoster,
} as Meta

const Template = args => <VerticalCardPoster {...args} />

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
