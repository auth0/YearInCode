import {Meta} from '@storybook/react/types-6-0'

import Star from './Star'
import {getMockData} from './Star.utils'

export default {
  title: 'Star',
  component: Star,
} as Meta

const Template = args => (
  <div className="h-screen">
    <Star {...args} />
  </div>
)

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
