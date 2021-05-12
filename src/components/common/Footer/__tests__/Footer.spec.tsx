import {fireEvent, render} from '@testing-library/react'

import Footer from '../Footer'

beforeEach(() => {
  // scrollIntoView is not defined into jsdom thus the need for this mock.
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

afterEach(jest.clearAllMocks)

describe('Footer', () => {
  describe("when the user clicks on 'Terms'", () => {
    it("displays 'Terms & Conditions'", () => {
      const {getByRole} = render(<Footer />)
      fireEvent.click(getByRole('button', {name: 'Terms'}))
      expect(
        getByRole('heading', {name: 'Terms & Conditions'}),
      ).toBeInTheDocument()
    })

    describe('and accepts the conditions', () => {
      it("hides the 'Terms & Conditions' section", () => {
        const {getByRole, queryByRole} = render(<Footer />)
        fireEvent.click(getByRole('button', {name: 'Terms'}))
        expect(
          getByRole('heading', {name: 'Terms & Conditions'}),
        ).toBeInTheDocument()
        fireEvent.click(getByRole('button', {name: 'Click to accept'}))
        expect(
          queryByRole('heading', {name: 'Terms & Conditions'}),
        ).not.toBeInTheDocument()
      })
    })
  })
})
