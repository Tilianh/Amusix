describe('Register user', () => {
  it('Register user with invalid username', () => {
    cy.request({
      method: 'POST',
      url: '/users/register',
      body: {userName: 'a', userDisplayName: 'Test', password: 'test'},
      failOnStatusCode: false
    }).then(response => expect(response.status).to.equal(403));
  });
  it('Register user with weak password', () => {
    cy.request({
      method: 'POST',
      url: '/users/register',
      body: {userName: 'test_', userDisplayName: 'Test', password: 'test'},
      failOnStatusCode: false
    }).then(response => expect(response.status).to.equal(403));
  });
  it('Register new user', () => {
    cy.request({
      method: 'POST',
      url: '/users/register',
      body: {userName: 'test_', userDisplayName: 'Test', password: 'Test$1234'}
    }).then(response => expect(response.status).to.equal(201));
  });
  it('Register duplicated user', () => {
    cy.request({
      method: 'POST',
      url: '/users/register',
      body: {userName: 'test_', password: 'test'},
      failOnStatusCode: false
    }).then(response => expect(response.status).to.equal(409));
  });
});

describe('Log in', () => {
  it('Log in invalid user', () => {
    cy.request({
      method: 'POST',
      url: '/users/login',
      body: {userName: 'anonymous', password: 'test'},
      failOnStatusCode: false
    }).then(response => expect(response.status).to.equal(404));
  });
  it('Log in with invalid password', () => {
    cy.request({
      method: 'POST',
      url: '/users/login',
      body: {userName: 'test_', password: 'test'},
      failOnStatusCode: false
    }).then(response => expect(response.status).to.equal(401));
  });
  it('Log in', () => {
    cy.login('test_', 'Test$1234');
  });
});

describe('Get current user', () => {
  it('Get current user without access token', () => {
    cy.checkPrivateRoute('/users/current', 'GET');
  });
  it('Get current user', () => {
    cy.tryRequest('/users/current', 'GET').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.userName).to.equal('test_');
    });
  });
});

describe('Change current user password', () => {
  it('Change password without access token', () => {
    cy.checkPrivateRoute('/users/current/updatePassword', 'PUT');
  });
  it('Change password with invalid password', () => {
    cy.tryRequest(
      '/users/current/updatePassword',
      'PUT',
      {oldPassword: 'test', newPassword: 'test'}
    ).then(response => expect(response.status).to.equal(403));
  });
  it('Change password with weak password', () => {
    cy.tryRequest(
      '/users/current/updatePassword',
      'PUT',
      {oldPassword: 'Test$1234', newPassword: 'test'}
    ).then(response => expect(response.status).to.equal(403));
  });
  it('Change password with same passwords', () => {
    cy.tryRequest(
      '/users/current/updatePassword',
      'PUT',
      {oldPassword: 'Test$1234', newPassword: 'Test$1234'}
    ).then(response => expect(response.status).to.equal(409));
  });
  it('Change password', () => {
    cy.tryRequest(
      '/users/current/updatePassword',
      'PUT',
      {oldPassword: 'Test$1234', newPassword: 'Test$4321'}
    ).then(response => expect(response.status).to.equal(200));
  });
  it('Log in again', () => {
    cy.login('test_', 'Test$4321');
  });
});
