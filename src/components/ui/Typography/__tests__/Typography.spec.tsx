import {render} from '@testing-library/react'

import Typography from '../Typography'

describe('Typography', () => {
  it('should render text', () => {
    const {getByRole} = render(
      <Typography variant="h1">Hello World</Typography>,
    )

    getByRole('heading', {name: /Hello World/i})
  })
})
