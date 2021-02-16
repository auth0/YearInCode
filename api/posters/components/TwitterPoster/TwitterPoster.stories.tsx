import * as React from 'react'
import {Meta} from '@storybook/react/types-6-0'

import {getMockData} from '@components/poster/Poster/Poster.utils'

import TwitterPoster from './TwitterPoster'

export default {
  title: 'Back-End/Twitter Poster',
  component: TwitterPoster,
} as Meta

const Template = args => <TwitterPoster {...args} />

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
