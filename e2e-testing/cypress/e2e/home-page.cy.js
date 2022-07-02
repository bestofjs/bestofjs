describe('Tests for BestOfJs/ Home page', () => {
    it('Check 3 tables Hot Projects, Recently Added Projects, Monthly Rankings', () => {
        cy.visit('https://bestofjs.org/');
        // Make sure all 3 tables are loaded
        cy.get('.css-wau20d').should('have.length', 3)
        
        // Check Hot Projects table should have 5 rows
        cy.contains('h2', 'Hot Projects')
        cy.get('.css-wau20d').first().find('tbody>tr').should('have.length', 5)

        // Check "Recently Added Projects" table should have 5 rows
        cy.contains('h2', 'Recently Added Projects')
        cy.get('.css-wau20d').eq(1).find('tbody>tr').should('have.length', 5)

        // Check "Monthly Rankings" table should have 5 rows
        cy.contains('h2', 'Monthly Rankings')
        cy.get('.css-wau20d').last().find('tbody>tr').should('have.length', 5)

        // Check View Full Rankings button at the bottom of table "Hot Projects"
        cy.get('.css-wau20d').first().find('tfoot>tr a').contains('View full rankings').click()
        cy.url().should('equal', 'https://bestofjs.org/projects?sort=daily')
        cy.contains('h1', 'All Projects')

        // Check View More button at the bottom of table "Recently Added Projects"
        cy.visit('https://bestofjs.org/')
        // Make sure all 3 tables are loaded
        cy.get('.css-wau20d').should('have.length', 3)
        // Get the 2nd table, click the View More button
        cy.get('.css-wau20d').eq(1).find('tfoot>tr a').contains("View more").click()
        // Redirect to Project page, sort=newest
        cy.url().should('equal', 'https://bestofjs.org/projects?sort=newest')
        cy.contains('h1', 'All Projects')

        // Check View Full Rankings button at the bottom of table "Monthly Rankings"
        cy.visit('https://bestofjs.org/')
        // Make sure all 3 tables are loaded
        cy.get('.css-wau20d').should('have.length', 3)
        // Get the last table, click View Full Rankings button
        cy.get('.css-wau20d').last().find('tfoot>tr a').contains("View full rankings").click()
        // Redirect to Monthly Rankings page
        cy.url().should('contains', 'https://bestofjs.org/rankings/monthly')
        cy.contains('h1', 'Monthly Rankings')
    })
});
