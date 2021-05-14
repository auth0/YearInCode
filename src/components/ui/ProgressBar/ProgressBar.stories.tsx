import {Meta} from '@storybook/react/types-6-0'

import ProgressBar from './ProgressBar'

export default {
  title: 'Front-End/Progress Bar',
  component: ProgressBar,
} as Meta

const Template = (args: Parameters<typeof ProgressBar>[0]) => (
  <div className="flex items-center justify-center min-h-screen">
    <ProgressBar {...args} />
  </div>
)

export const Basic = Template.bind({})

Basic.args = {
  max: 100,
  value: 30,
  className: 'max-w-md',
}
