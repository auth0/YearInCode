import {Meta} from '@storybook/react/types-6-0'

import Poster from './Poster'
import {getMockData} from './Poster.utils'

export default {
  title: 'Front-End/Poster',
  component: Poster,
} as Meta

const Template = args => <Poster wrapperStyle={{height: '90vh'}} {...args} />

export const Basic = Template.bind({})

Basic.args = {
  data: getMockData(),
}
