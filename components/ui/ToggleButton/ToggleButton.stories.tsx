import {Meta} from '@storybook/react/types-6-0'

import ToggleButton from './ToggleButton'

export default {
  title: 'Toggle Button',
  component: ToggleButton,
} as Meta

const Template = args => (
  <div className="flex items-center justify-center min-h-screen">
    <ToggleButton {...args} />
  </div>
)

export const Basic = Template.bind({})

Basic.args = {
  children: '2017',
}
