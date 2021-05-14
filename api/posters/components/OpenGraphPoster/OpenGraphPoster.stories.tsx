import * as React from 'react'
import {Meta} from '@storybook/react/types-6-0'

import {getMockData} from '@components/poster/Poster/Poster.utils'

import OpenGraphPoster from './OpenGraphPoster'

export default {
  title: 'Back-End/Open Graph Poster',
  component: OpenGraphPoster,
} as Meta

const Template = (args: Parameters<typeof OpenGraphPoster>[0]) => (
  <OpenGraphPoster {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
