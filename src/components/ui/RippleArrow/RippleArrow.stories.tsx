import {Meta} from '@storybook/react/types-6-0'

import RippleArrow from './RippleArrow'

export default {
  title: 'Front-End/Ripple Arrow',
  component: RippleArrow,
} as Meta

const Template = args => (
  <div className="flex items-center justify-center min-h-screen">
    <RippleArrow {...args} />
  </div>
)

export const Basic = Template.bind({})
