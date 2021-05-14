import React from 'react'
import {Meta} from '@storybook/react/types-6-0'

import Typography, {Variants} from './Typography'

export default {
  title: 'Front-End/Typography',
  component: Typography,
} as Meta

const variants: Variants[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body1',
  'body2',
  'caption',
]

const Template = (args: Parameters<typeof Typography>[0]) => (
  <Typography {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  variant: 'h1',
  children: 'Hello World!',
}

export const All = (args: Parameters<typeof Template>[0]) => (
  <>
    {variants.map(variant => (
      <Template key={variant} {...args} variant={variant} />
    ))}
  </>
)

All.args = {
  children: 'Hello World!',
}
