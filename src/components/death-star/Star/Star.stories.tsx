import {Meta} from '@storybook/react/types-6-0'

import Star from './Star'
import {getMockData} from './Star.utils'

export default {
  title: 'Star',
  component: Star,
} as Meta

const Template = args => <Star wrapperStyle={{height: '90vh'}} {...args} />

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
