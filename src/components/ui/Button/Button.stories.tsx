import {Meta, Story} from '@storybook/react/types-6-0'

import Button from './Button'

export default {
  title: 'Front-End/Button',
  component: Button,
} as Meta

const Icon = () => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.2511 0.734288C14.9395 0.918278 15.4816 1.4605 15.6656 2.14878C16 3.39667 16 5.99993 16 5.99993C16 5.99993 16 8.60331 15.6656 9.85107C15.4816 10.5394 14.9395 11.0817 14.2511 11.2656C13.0034 11.6 7.99993 11.6 7.99993 11.6C7.99993 11.6 2.99665 11.6 1.74889 11.2656C1.06048 11.0817 0.518385 10.5394 0.334395 9.85107C0 8.60331 0 5.99993 0 5.99993C0 5.99993 0 3.39667 0.334395 2.14878C0.518385 1.4605 1.06048 0.918278 1.74889 0.734288C2.99665 0.400024 7.99993 0.400024 7.99993 0.400024C7.99993 0.400024 13.0034 0.400024 14.2511 0.734288ZM10.5567 6.00007L6.39998 8.39997V3.59991L10.5567 6.00007Z"
      fill="white"
    />
  </svg>
)

const Template: Story<Parameters<typeof Button>[0]> = args => (
  <div className="flex items-center justify-center min-h-screen">
    <Button {...args} />
  </div>
)

export const Basic = Template.bind({})

Basic.args = {
  children: 'See How it Works',
  icon: <Icon />,
  size: 'default',
}

export const Primary = Template.bind({})

Primary.args = {
  color: 'primary',
  children: 'Primary',
  size: 'default',
}

export const Link = Template.bind({})

Link.args = {
  children: 'This is a link',
  size: 'default',
  href: '#',
}

export const Large = Template.bind({})

Large.args = {
  color: 'primary',
  children: 'Primary',
  size: 'large',
}

export const Outlined = Template.bind({})

Outlined.args = {
  color: 'primary',
  variant: 'outlined',
  children: 'See How it Works',
  size: 'default',
}

export const Loading = Template.bind({})

Loading.args = {
  color: 'primary',
  children: 'See How it Works',
  size: 'default',
  loading: true,
}
