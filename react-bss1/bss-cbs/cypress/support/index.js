// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './hooks';
import 'cypress-real-events/support';

const urljoin = require('url-join');
const addContext = require('mochawesome/addContext');

// Alternatively you can use CommonJS syntax:
// require('./commands')

function getAccessToken() {
  const sso = Cypress.env('testMode') === 'sd' ? Cypress.env('sdSso') : Cypress.env('sso');
  const url = `${urljoin(sso.url, 'oauth2/token')}`;
  return cy.request({
    url,
    method: 'POST',
    form: true,
    body: {
      client_id: sso.client_id,
      client_secret: sso.client_secret,
      grant_type: 'password',
      scope: 'openid',
      username: sso.username,
      password: sso.password
    }
  });
}

function initLocalStorage() {
  console.log('Initializing Local Storage');
  return getAccessToken().then(function(response) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('access_token', response.body.access_token);
  });
}

before(function() {
  initLocalStorage();
  cy.visit('/bss-cbs-app-upgrade-ui/');
});

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`;
    addContext({ test }, `assets/${Cypress.spec.name}/${screenshotFileName}`);
  }
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
