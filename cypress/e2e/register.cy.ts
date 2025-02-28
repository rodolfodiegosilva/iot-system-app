describe('Register Test - Comprehensive Error Scenarios', () => {
  beforeEach(() => {
    // Visit the register page before each test
    cy.visit(Cypress.env('baseUrl') + '/register');
  });

  it('Should show errors when all fields are empty', () => {
    // Verify that the submit button is disabled when all fields are empty
    cy.get('button[type="submit"]').should('be.disabled');

    // Attempt to interact and verify that error messages are shown for all required fields
    cy.get('input[id="name"]').focus().blur();
    cy.get('input[id="email"]').focus().blur();
    cy.get('input[id="username"]').focus().blur();
    cy.get('input[id="password"]').focus().blur();
    cy.get('input[id="confirmPassword"]').focus().blur();

    // Verify the error messages
    cy.get('.error').should('contain', 'Name is required');
    cy.get('.error').should('contain', 'Email is required');
    cy.get('.error').should('contain', 'Username is required');
    cy.get('.error').should('contain', 'Password is required');
    cy.get('.error').should('contain', 'Confirm Password is required');
  });

  it('Should show error for invalid email format', () => {
    // Fill in the fields with an invalid email format
    cy.get('input[id="name"]').type('Test Name');
    cy.get('input[id="email"]').type('invalid-email');
    cy.get('input[id="username"]').type('testuser');
    cy.get('input[id="password"]').type('securePassword');
    cy.get('input[id="confirmPassword"]').type('securePassword');

    // The submit button should now be enabled because all fields are filled
    cy.get('button[type="submit"]').should('not.be.disabled');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify that an error message for invalid email format is shown
    cy.get('.error').should('contain', 'Email must be a valid email address');
  });

  it('Should show error for password mismatch', () => {
    // Fill in the fields with non-matching passwords
    cy.get('input[id="name"]').type('Test Name');
    cy.get('input[id="email"]').type('test@example.com');
    cy.get('input[id="username"]').type('testuser');
    cy.get('input[id="password"]').type('securePassword');
    cy.get('input[id="confirmPassword"]').type('differentPassword');

    // The submit button should now be enabled
    cy.get('button[type="submit"]').should('not.be.disabled');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify that an error message for password mismatch is shown
    cy.get('.error').should('contain', 'Passwords must match');
  });

  it('Should show error when email is already in use', () => {
    // Fill in the fields with an already registered email
    cy.get('input[id="name"]').type('Another Name');
    cy.get('input[id="email"]').type('test@example.com'); // Already registered email
    cy.get('input[id="username"]').type('anotheruser');
    cy.get('input[id="password"]').type('anotherPassword');
    cy.get('input[id="confirmPassword"]').type('anotherPassword');

    // The submit button should now be enabled
    cy.get('button[type="submit"]').should('not.be.disabled');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify that an error message for already used email is shown
    cy.get('.error', { timeout: 10000 }).should(
      'contain',
      'Email already in use'
    );
  });

  it('Should show error when username is already in use', () => {
    // Fill in the fields with an already registered username
    cy.get('input[id="name"]').type('Another Name');
    cy.get('input[id="email"]').type('newemail@example.com');
    cy.get('input[id="username"]').type('testuser'); // Already registered username
    cy.get('input[id="password"]').type('anotherPassword');
    cy.get('input[id="confirmPassword"]').type('anotherPassword');

    // The submit button should now be enabled
    cy.get('button[type="submit"]').should('not.be.disabled');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify that an error message for already used username is shown
    cy.get('.error', { timeout: 10000 }).should(
      'contain',
      'Username already in use'
    );
  });

  it('Should disable submit button when form is invalid', () => {
    // Fill in only one field to keep the form invalid
    cy.get('input[id="name"]').type('Test Name');

    // Verify that the submit button is still disabled
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
