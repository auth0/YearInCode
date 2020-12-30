describe('Queue Star', () => {
  it('should queue on request', () => {
    cy.request(
      'POST',
      `${Cypress.env('serverless_api_url')}/death-star/queue`,
      {userId: 'github|1241'},
    )
      .its('body')
      .its('message')
      .should('include', 'QUEUED STAR WITH ID:')
  })

  it("should throw error if no 'userId' is sent", () => {
    cy.request({
      method: 'POST',
      failOnStatusCode: false,
      url: `${Cypress.env('serverless_api_url')}/death-star/queue`,
    }).then(({body, status}) => {
      expect(status).to.equal(400)
      expect(body).to.equal('Event object failed validation')
    })
  })
})
