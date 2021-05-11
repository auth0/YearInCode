import {fireEvent, render} from '@testing-library/react'

import Footer from '../Footer'

describe('Footer', () => {
  beforeEach(jest.clearAllMocks)

  describe("when the user clicks on 'Terms'", () => {
    jest
      .spyOn(require('next/router'), 'useRouter')
      .mockReturnValue({push: jest.fn().mockResolvedValue(null)})

    it("displays 'Terms & Conditions'", () => {
      const {getByText} = render(<Footer />)
      fireEvent.click(getByText('Terms'))
      expect(getByText('Terms & Conditions')).toBeInTheDocument()
    })

    describe('and accepts the conditions', () => {
      it("hides the 'Terms & Conditions' section", () => {
        const {getByText, queryByText} = render(<Footer />)
        fireEvent.click(getByText('Terms'))
        expect(getByText('Terms & Conditions')).toBeInTheDocument()
        fireEvent.click(getByText(/Click to accept/i))
        expect(queryByText('Terms & Condtions')).not.toBeInTheDocument()
      })
    })
  })
})
