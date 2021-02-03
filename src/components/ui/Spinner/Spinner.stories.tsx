import {Meta} from '@storybook/react/types-6-0'

import Spinner from './Spinner'

export default {
  title: 'Spinner',
  component: Spinner,
} as Meta

const Template = args => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner {...args} />
  </div>
)

export const Basic = Template.bind({})
