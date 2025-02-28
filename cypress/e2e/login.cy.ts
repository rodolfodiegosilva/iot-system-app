describe('Login Test', () => {
    it('Should login successfully with valid credentials', () => {
      // Visit the login page
      cy.visit(Cypress.env('baseUrl') + '/login');

      
      // Enter the username and password
      cy.get('input[name="username"]').type('seu-usuario');
      cy.get('input[name="password"]').type('sua-senha');
      
      // Click the login button
      cy.get('button[type="submit"]').click();
      
      // Assert the login was successful by checking the URL or a specific element
      cy.url().should('include', '/home'); // Verifica se a URL inclui '/home'
    });
  
    it('Should display error with invalid credentials', () => {
      // Visit the login page
      cy.visit(Cypress.env('baseUrl') + '/login');

      
      // Enter an invalid username and password
      cy.get('input[name="username"]').type('usuario-invalido');
      cy.get('input[name="password"]').type('senha-invalida');
      
      // Click the login button
      cy.get('button[type="submit"]').click();
      
      // Assert the error message is displayed
      cy.get('.error-message').should('be.visible').and('contain', 'Credenciais inválidas');
    });
  });
  