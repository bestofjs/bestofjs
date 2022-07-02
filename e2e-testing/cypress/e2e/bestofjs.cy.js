describe('Tests for BestOfJs', () => {
  it('Check internal pages are loaded, external links are correct', () => {
    // Check Home page is present
    cy.visit('https://bestofjs.org/');
    cy.contains('h1', 'The best of JavaScript, HTML and CSS');

    // Check Projects page is present
    cy.contains('Projects').click();
    cy.url().should('equal', 'https://bestofjs.org/projects');
    cy.get('h1').should('have.text', 'All Projects');

    // Check Tags page is present
    cy.contains('Tags').click();
    cy.url().should('equal', 'https://bestofjs.org/tags');
    cy.get('h1').should('have.text', 'All Tags');

    // Check Montly Rankings page is present
    cy.contains('More').click();
    cy.contains('Monthly rankings').click();
    cy.url().should('equal', 'https://bestofjs.org/rankings/monthly');
    cy.get('h1').should('have.text', 'Monthly Rankings');

    // Check Hall of Fame page is present
    cy.contains('More').click();
    cy.contains('Hall of fame').click();
    cy.url().should('equal', 'https://bestofjs.org/hall-of-fame');
    cy.get('h1').should('have.text', 'JavaScript Hall of Fame');

    // Check Timeline page is present
    cy.contains('More').click();
    cy.contains('Timeline').click();
    cy.url().should('equal', 'https://bestofjs.org/timeline');
    cy.contains('h1', 'Timeline');

    // Check About page is present
    cy.contains('More').click();
    cy.contains('About').click();
    cy.url().should('equal', 'https://bestofjs.org/about');
    cy.get('h1').should('have.text', 'About');

    // Check external link https://risingstars.js.org
    cy.contains('Rising Stars').should(
      'have.attr',
      'href',
      'https://risingstars.js.org',
    );

    // Check external link https://stateofjs.com
    cy.contains('State of JS').should(
      'have.attr',
      'href',
      'https://stateofjs.com',
    );
  });
});
