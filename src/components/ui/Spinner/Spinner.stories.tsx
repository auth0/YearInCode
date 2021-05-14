import {Meta} from '@storybook/react/types-6-0'

import Spinner from './Spinner'

export default {
  title: 'Front-End/Spinner',
  component: Spinner,
} as Meta

const Template = (args: typeof Spinner['arguments']) => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner {...args} />
  </div>
)

export const Basic = Template.bind({})
