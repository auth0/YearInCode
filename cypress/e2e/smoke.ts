describe('smoke', () => {
  it.only('should allow a typical user flow', () => {
    cy.visit('/')

    cy.findByRole('heading', {name: 'Next.js and Auth0 Example'}).should(
      'exist',
    )
  })
})
