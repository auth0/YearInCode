import * as React from 'react'
import {Meta, Story} from '@storybook/react/types-6-0'

import {getMockData} from '@components/poster/Poster/Poster.utils'

import InstagramPoster from './InstagramPoster'

export default {
  title: 'Back-End/Instagram Poster',
  component: InstagramPoster,
} as Meta

const Template: Story<Parameters<typeof InstagramPoster>[0]> = args => (
  <InstagramPoster {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
