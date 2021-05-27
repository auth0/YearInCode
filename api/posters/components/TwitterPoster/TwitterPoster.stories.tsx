import * as React from 'react'
import {Meta, Story} from '@storybook/react/types-6-0'

import {getMockData} from '@components/poster/Poster/Poster.utils'

import TwitterPoster from './TwitterPoster'

export default {
  title: 'Back-End/Twitter Poster',
  component: TwitterPoster,
} as Meta

const Template: Story<Parameters<typeof TwitterPoster>[0]> = args => (
  <TwitterPoster {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
