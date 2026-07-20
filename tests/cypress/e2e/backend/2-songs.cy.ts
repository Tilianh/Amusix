import { TestVariables } from '../../support/test-variables';

/**
 * Verify that a song is in a playlist.
 * @param playlistId ID of the playlist containing the song.
 * @param songId ID of the song to check.
 * @param position Position of the song in the playlist (default = 1).
 */
function verifySongInPlaylist(playlistId: string, songId: string, position = 1) {
  cy.log(playlistId, songId, position);
  cy.tryRequest(`/playlists/${playlistId}/songs`, 'GET').then(response => {
    expect(response.status).to.equal(200);
    expect(response.body.items.length).to.be.at.least(position);
    expect(response.body.items[position - 1].ytbId).to.equal(songId);
  });
}

before(() => cy.login('test_', 'Test$4321'));

describe('Make song search', () => {
  it('Get songs without access token', () => {
    cy.checkPrivateRoute('/songs/search', 'POST');
  });
  it('Search songs', () => {
    cy.tryRequest(
      '/songs/search',
      'POST',
      {searchText: 'micheal jackson beat it'}
    ).then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.be.greaterThan(0);
      TestVariables.songItem = response.body.items[0];
      cy.log(TestVariables.songItem);
      expect(TestVariables.songItem.name.toLowerCase()).to.include('beat it');
    });
  });
});

describe('Add song to new playlist', () => {
  it('Create playlist without access token', () => {
    cy.checkPrivateRoute('/playlists', 'POST');
  });
  it('Add song to new playlist', () => {
    cy.tryRequest(
      '/playlists',
      'POST',
      {
        playlistName: "Test",
        songYtbId: TestVariables.songItem.ytbId,
        songPublishedAt: TestVariables.songItem.publishedAt,
        songDuration: TestVariables.songItem.duration,
        songName: TestVariables.songItem.name,
        songArtistName: TestVariables.songItem.artistName,
        songThumbnailUrl: TestVariables.songItem.thumbnailUrl,
        songStatus: 0
      }
    ).then(response => {
      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('Test');
    });
  });
  it('Verify playlist creation', () => {
    cy.tryRequest('/playlists', 'GET').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.be.greaterThan(0);
      TestVariables.playlistItem = response.body.items[0];
      expect(TestVariables.playlistItem.name).to.equal('Test');
    });
  });
  it('Verify song in playlist', () => {
    cy.log(TestVariables.songItem);
    verifySongInPlaylist(TestVariables.playlistItem.id, TestVariables.songItem.ytbId);
  });
});

describe('Add song to existing playlist', () => {
  it('Add song without access token', () => {
    cy.checkPrivateRoute(`/playlists/${TestVariables.playlistItem.id}/songs`, 'POST');
  });
  it('Add song to invalid playlist', () => {
    cy.tryRequest(
      `/playlists/1a1a1a1a-2b2b-3c3c-4d4d-5e5e5e5e5e5e/songs`,
      'POST',
      {
        songYtbId: TestVariables.songItem.ytbId,
        songPublishedAt: TestVariables.songItem.publishedAt,
        songDuration: TestVariables.songItem.duration,
        songName: TestVariables.songItem.name,
        songArtistName: TestVariables.songItem.artistName,
        songThumbnailUrl: TestVariables.songItem.thumbnailUrl,
        songStatus: 0
      }
    )
      .then(response => expect(response.status).to.equal(404));
  });
  it('Add song already added to a playlist', () => {
    cy.tryRequest(
      `/playlists/${TestVariables.playlistItem.id}/songs`,
      'POST',
      {
        songYtbId: TestVariables.songItem.ytbId,
        songPublishedAt: TestVariables.songItem.publishedAt,
        songDuration: TestVariables.songItem.duration,
        songName: TestVariables.songItem.name,
        songArtistName: TestVariables.songItem.artistName,
        songThumbnailUrl: TestVariables.songItem.thumbnailUrl,
        songStatus: 0
      }
    ).then(response => expect(response.status).to.equal(409));
  });
  it('Add song to existing playlist', () => {
    cy.tryRequest(
      '/songs/search',
      'POST',
      {searchText: 'dire straits sultans of swing'}
    ).then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.be.greaterThan(0);
      TestVariables.songItem = response.body.items[0];
      cy.tryRequest(
        `/playlists/${TestVariables.playlistItem.id}/songs`,
        'POST',
        {
          songYtbId: TestVariables.songItem.ytbId,
          songPublishedAt: TestVariables.songItem.publishedAt,
          songDuration: TestVariables.songItem.duration,
          songName: TestVariables.songItem.name,
          songArtistName: TestVariables.songItem.artistName,
          songThumbnailUrl: TestVariables.songItem.thumbnailUrl,
          songStatus: 0
        }
      ).then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(TestVariables.songItem.name);
      });
    });
  });
  it('Verify song in playlist', () => {
    verifySongInPlaylist(TestVariables.playlistItem.id, TestVariables.songItem.ytbId);
  });
});

describe('Remove song from playlist', () => {
  it('Remove song without access token', () => {
    cy.checkPrivateRoute(`/playlists/${TestVariables.playlistItem.id}/songs/test`, 'DELETE');
  });
  it('Remove song from invalid playlist', () => {
    cy.tryRequest(`/playlists/1a1a1a1a-2b2b-3c3c-4d4d-5e5e5e5e5e5e/songs/test`, 'DELETE')
      .then(response => expect(response.status).to.equal(404));
  });
  it('Remove invalid song from playlist', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}/songs/test`, 'DELETE')
      .then(response => expect(response.status).to.equal(404));
  });
  it('Remove song from playlist', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}/songs/${TestVariables.songItem.ytbId}`, 'DELETE')
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.ytbId).to.equal(TestVariables.songItem.ytbId);
      });
  });
  it('Verify song not in playlist', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}/songs`, 'GET').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.equal(1);
      TestVariables.songItem = response.body.items[0];
      expect(TestVariables.songItem.name).to.not.include('sultans of swing');
    });
  });
});

describe('Change song status', () => {
  it('Change song status without access token', () => {
    cy.checkPrivateRoute(`/playlists/${TestVariables.playlistItem.id}/songs/${TestVariables.songItem.ytbId}/updateStatus`, 'PUT');
  });
  it('Change song status from invalid playlist', () => {
    cy.tryRequest(
      `/playlists/1a1a1a1a-2b2b-3c3c-4d4d-5e5e5e5e5e5e/songs/${TestVariables.songItem.ytbId}/updateStatus`,
      'PUT',
      {songStatus: 1})
      .then(response => expect(response.status).to.equal(404));
  });
  it('Change status of invalid song', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}/songs/test/updateStatus`, 'PUT', {songStatus: 1})
      .then(response => expect(response.status).to.equal(404));
  });
  it('Change song status', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}/songs/${TestVariables.songItem.ytbId}/updateStatus`, 'PUT', {songStatus: 1})
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.ytbId).to.equal(TestVariables.songItem.ytbId);
        expect(response.body.status).to.equal(1);
      });
  });
  it('Verify song status in playlist', () => {
    cy.tryRequest(`/playlists/${TestVariables.playlistItem.id}/songs`, 'GET').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body.items.length).to.equal(1);
      expect(response.body.items[0].ytbId).to.equal(TestVariables.songItem.ytbId);
      expect(response.body.items[0].status).to.equal(1);
    });
  });
});
