import {Meta, Story} from '@storybook/react/types-6-0'

import Alert from './Alert'

export default {
  title: 'Front-End/Alert',
  component: Alert,
} as Meta

const Template: Story<Parameters<typeof Alert>[0]> = args => (
  <div className="flex items-center justify-center min-h-screen">
    <Alert {...args} />
  </div>
)

export const Basic = Template.bind({})

Basic.args = {
  type: 'warning',
  children:
    "Creating your Year In Code can take around an hour. We'll email you when it’s ready!",
}
