describe('Index page smoke test', () => {
  it('should allow a typical user flow', () => {
    cy.visit('/')

    cy.findByRole('heading', {
      name: 'You’re the heart of innovation.So share your journey.',
    }).should('exist')
  })
})
