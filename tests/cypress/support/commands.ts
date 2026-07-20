import { TestVariables } from './test-variables';

Cypress.Commands.add('checkPrivateRoute', (url, method) => {
  cy.request({method, url, failOnStatusCode: false}).then(response => expect(response.status).to.eq(401));
});

Cypress.Commands.add('login', (username, password) => {
  return cy.request({
    method: 'POST',
    url: '/users/login',
    body: {userName: username, password}
  }).then(response => {
    if (response.status == 200) TestVariables.accessToken = response.body.accessToken;
  });
});

Cypress.Commands.add('tryRequest', (url, method, body?) => {
  return cy.request({
    url: url,
    method: method,
    body: body,
    headers: TestVariables.accessToken ? {Authorization: `Bearer ${TestVariables.accessToken}`} : undefined,
    failOnStatusCode: false
  });
});
