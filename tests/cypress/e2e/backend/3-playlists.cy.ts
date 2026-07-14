import { TestVariables } from '../../support/test-variables';

before(() => cy.login('test', 'Test$4321'));

describe('Get current user playlists', () => {
  it('Get playlists without access token', () => {
    cy.checkPrivateRoute('/playlists', 'GET');
  });
  it('Get playlists', () => {
    cy.tryRequest('/playlists', 'GET').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.be.greaterThan(0);
      TestVariables.playlistItem = response.body.items[0];
    });
  });
});

describe('Update current user playlist', () => {
  it('Update playlist without access token', () => {
    cy.checkPrivateRoute(`/playlists/${TestVariables.playlistItem.id}`, 'PUT');
  });
  it('Update invalid playlist', () => {
    cy.tryRequest(`/playlists/1a1a1a1a-2b2b-3c3c-4d4d-5e5e5e5e5e5e`, 'PUT', {playlistName: 'Test2'})
      .then(response => expect(response.status).to.equal(404));
  });
  it('Update playlist', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}`, 'PUT', {playlistName: 'Test2'})
      .then(response => {
        expect(response.status).to.equal(200);
        TestVariables.playlistItem = response.body;
        expect(TestVariables.playlistItem.name).to.equal('Test2');
      });
  });
  it('Verify playlist update', () => {
    cy.tryRequest(`/playlists`, 'GET').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.equal(1);
      expect(response.body.items[0].id).to.equal(TestVariables.playlistItem.id);
      expect(response.body.items[0].name).to.equal(TestVariables.playlistItem.name);
    });
  });
});

describe('Delete current user playlist', () => {
  it('Delete playlist without access token', () => {
    cy.checkPrivateRoute(`/playlists/${TestVariables.playlistItem.id}`, 'DELETE');
  });
  it('Delete invalid playlist', () => {
    cy.tryRequest(`/playlists/1a1a1a1a-2b2b-3c3c-4d4d-5e5e5e5e5e5e`, 'DELETE')
      .then(response => expect(response.status).to.equal(404));
  });
  it('Delete playlist', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}`, 'DELETE')
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(TestVariables.playlistItem.id);
      });
  });
  it('Verify playlist deletion', () => {
    cy.tryRequest(`/playlists`, 'GET').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.equal(0);
    });
  });
});
