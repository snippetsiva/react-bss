// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (username, password) => {
  // cy.visit('/dmld-web-ui/');
  cy.get('[data-cy=userName]').type(username);
  cy.get('[data-cy=password]').click();
  cy.wait(2500);
  cy.get('[data-cy=password]').type(password);
  cy.contains('Sign-in').click();
  cy.wait(12000);
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=logout-btn]').click();
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';
