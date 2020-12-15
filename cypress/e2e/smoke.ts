import {buildUserProfile} from '../support/generate'

describe('Index page smoke test', () => {
  it('should allow a typical user flow', () => {
    const userProfile = buildUserProfile()
    cy.intercept(`${Cypress.env('api_url')}/me`, {
      statusCode: 200,
      body: userProfile,
    })
    cy.intercept(`${Cypress.env('api_url')}/login`)

    cy.visit('/')

    cy.findByRole('heading', {name: 'Next.js and Auth0 Example'}).should(
      'exist',
    )
    cy.findByText(new RegExp(`nickname: ${userProfile.nickname}`, 'i')).should(
      'exist',
    )
    cy.findByText(new RegExp(`name: ${userProfile.name}`, 'i')).should('exist')
  })
})
