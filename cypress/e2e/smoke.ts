describe('Index page smoke test', () => {
  it('should allow a typical user flow', () => {
    cy.visit('/')

    cy.findByRole('heading', {
      name: 'You’re the heart of innovation.Tell your journey today.',
    }).should('exist')
  })
})
