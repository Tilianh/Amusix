using AmusixBackapp.Data;
using AmusixBackapp.Data.Models;
using AmusixBackapp.Shared;
using AmusixBackapp.Shared.Classes;
using AmusixBackapp.Shared.Classes.Pagination;
using AmusixBackapp.Shared.Enums;
using AmusixBackapp.Shared.ViewModels.Playlists;
using AmusixBackapp.Shared.ViewModels.Songs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AmusixBackapp.Controllers;

/// <summary>
/// Controller to manage song playlists.
/// </summary>
/// <param name="db"></param>
[ApiController, Route("playlists")]
public class PlaylistController(AppDbContext db) : AmxControllerBase
{
    #region playlists

    /// <summary>
    /// Get current user's playlists.
    /// </summary>
    /// <param name="pageToken">Returned items page token.</param>
    /// <returns>Playlists corresponding to the page.</returns>
    [HttpGet, HttpGet("{pageToken}")]
    [Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<PaginatedListPage<PlaylistInfoVm>> GetCurrentUserPlaylists(string? pageToken = null)
    {
        var currentUserId = GetCurrentUserId();

        var playlists = db.Playlists
            .Where(x => x.UserId == currentUserId)
            .Select(x => new PlaylistInfoVm
            {
                Id = x.Id,
                Name = x.Name,
                ThumbnailUrl =
                    x.Songs.Count > 0 ? x.Songs.OrderByDescending(y => y.AddedAt).First().ThumbnailUrl : null,
                CreatedAt = x.CreatedAt,
                LastUpdatedAt = x.LastUpdatedAt,
                SongCount = x.Songs.Count
            })
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        return JsonResult(StatusCodes.Status200OK, new PaginatedList<PlaylistInfoVm>(playlists).Page(pageToken));
    }

    /// <summary>
    /// Get one of the current user's playlists.
    /// </summary>
    /// <param name="playlistId">ID of the playlist to get.</param>
    /// <returns>Corresponding playlist.</returns>
    [HttpGet("{playlistId:guid}"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<PlaylistInfoVm> GetCurrentUserPlaylist(Guid playlistId)
    {
        var playlistDb = db.Playlists.Include(x => x.Songs).FirstOrDefault(x => x.Id == playlistId);

        if (playlistDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Playlist not found" });

        if (playlistDb.UserId != GetCurrentUserId())
            return JsonResult(StatusCodes.Status403Forbidden,
                new { Message = "Current user is not authorized to access this playlist" });

        return JsonResult(StatusCodes.Status200OK,
            new PlaylistInfoVm
            {
                Id = playlistDb.Id,
                Name = playlistDb.Name,
                ThumbnailUrl = playlistDb.Songs.OrderByDescending(x => x.AddedAt).FirstOrDefault()?.ThumbnailUrl,
                CreatedAt = playlistDb.CreatedAt,
                LastUpdatedAt = playlistDb.LastUpdatedAt,
                SongCount = playlistDb.Songs.Count
            });
    }

    /// <summary>
    /// Add a playlist (from a song) to the current user's.
    /// </summary>
    /// <param name="playlistForm">Playlist to add.</param>
    /// <returns>Added playlist.</returns>
    [HttpPost, Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PlaylistSongVm>> AddPlaylistFromSongAsync(PlaylistAddFormVm playlistForm)
    {
        Playlist playlistDb = new()
        {
            Id = Guid.NewGuid(),
            Name = playlistForm.PlaylistName,
            UserId = GetCurrentUserId()!.Value,
            CreatedAt = DateTime.Now,
            LastUpdatedAt = DateTime.Now
        };

        PlaylistSong songDb = new()
        {
            YtbId = playlistForm.SongYtbId,
            PlaylistId = playlistDb.Id,
            AddedAt = DateTime.Now,
            PublishedAt = playlistForm.SongPublishedAt,
            Duration = playlistForm.SongDuration,
            Name = playlistForm.SongName,
            ArtistName = playlistForm.SongArtistName,
            ThumbnailUrl = playlistForm.SongThumbnailUrl,
            Status = playlistForm.SongStatus
        };

        db.Playlists.Add(playlistDb);
        db.PlaylistSongs.Add(songDb);
        await db.SaveChangesAsync();

        return JsonResult(StatusCodes.Status201Created,
            new PlaylistInfoVm
            {
                Id = playlistDb.Id,
                Name = playlistDb.Name,
                CreatedAt = playlistDb.CreatedAt,
                LastUpdatedAt = playlistDb.LastUpdatedAt,
                SongCount = 1
            });
    }

    /// <summary>
    /// Update one of current user's playlists.
    /// </summary>
    /// <param name="playlistId">ID of the playlist to update.</param>
    /// <param name="playlistForm">Playlist to update.</param>
    /// <returns>Updated playlist.</returns>
    [HttpPut("{playlistId:guid}"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PlaylistInfoVm>> UpdatePlaylistAsync(Guid playlistId, 
        PlaylistUpdateFormVm playlistForm)
    {
        var playlistDb = db.Playlists.FirstOrDefault(x => x.Id == playlistId);

        if (playlistDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Playlist not found" });

        if (playlistDb.UserId != GetCurrentUserId())
            return JsonResult(StatusCodes.Status403Forbidden,
                new { Message = "Current user is not authorized to update this playlist" });

        playlistDb.Name = playlistForm.PlaylistName;
        playlistDb.LastUpdatedAt = DateTime.Now;
        await db.SaveChangesAsync();

        return JsonResult(StatusCodes.Status200OK,
            new PlaylistInfoVm
            {
                Id = playlistDb.Id,
                Name = playlistDb.Name,
                CreatedAt = playlistDb.CreatedAt,
                LastUpdatedAt = playlistDb.LastUpdatedAt
            });
    }

    /// <summary>
    /// Delete one of the current user's playlists.
    /// </summary>
    /// <param name="playlistId">ID of the playlist to delete.</param>
    /// <returns>Deleted playlist.</returns>
    [HttpDelete("{playlistId:guid}"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PlaylistInfoVm>> DeletePlaylistAsync(Guid playlistId)
    {
        var playlistDb = db.Playlists.FirstOrDefault(x => x.Id == playlistId);

        if (playlistDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Playlist not found" });

        if (playlistDb.UserId != GetCurrentUserId())
            return JsonResult(StatusCodes.Status403Forbidden,
                new { Message = "Current user is not authorized to delete this playlist" });

        db.Playlists.Remove(playlistDb);
        await db.SaveChangesAsync();

        return JsonResult(StatusCodes.Status200OK,
            new PlaylistInfoVm
            {
                Id = playlistDb.Id,
                Name = playlistDb.Name,
                CreatedAt = playlistDb.CreatedAt,
                LastUpdatedAt = playlistDb.LastUpdatedAt
            });
    }

    #endregion

    #region playlist songs

    /// <summary>
    /// Get songs contained in one of the current's user playlists.
    /// </summary>
    /// <param name="playlistId">ID of the playlist containing the songs to get.</param>
    /// <param name="pageToken">Returned items page token.</param>
    /// <returns>Songs corresponding to the page.</returns>
    [HttpGet("{playlistId:guid}/songs"), HttpGet("{playlistId:guid}/songs/{pageToken}")]
    [Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<PaginatedListPage<PlaylistSongVm>> GetPlaylistSongs(Guid playlistId, string? pageToken = null)
    {
        var playlistDb = db.Playlists.Include(x => x.Songs).FirstOrDefault(x => x.Id == playlistId);

        if (playlistDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Playlist not found" });

        if (playlistDb.UserId != GetCurrentUserId())
            return JsonResult(StatusCodes.Status403Forbidden,
                new { Message = "Current user is not authorized to access this playlist" });

        var songs = playlistDb.Songs
            .Select(x => new PlaylistSongVm
            {
                YtbId = x.YtbId,
                PlaylistId = x.PlaylistId,
                AddedAt = x.AddedAt,
                PublishedAt = x.PublishedAt,
                Duration = x.Duration,
                Name = x.Name,
                ArtistName = x.ArtistName,
                ThumbnailUrl = x.ThumbnailUrl,
                Status = x.Status
            })
            .OrderByDescending(x => x.AddedAt)
            .ToList();

        return JsonResult(StatusCodes.Status200OK, new PaginatedList<PlaylistSongVm>(songs).Page(pageToken));
    }

    /// <summary>
    /// Add a song to one of the current user's playlists.
    /// </summary>
    /// <param name="playlistId">ID of the playlist to add the song to.</param>
    /// <param name="songForm">Song to add to the playlist.</param>
    /// <returns>Added song.</returns>
    [HttpPost("{playlistId:guid}/songs"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PlaylistSongVm>> AddSongAsync(Guid playlistId, PlaylistSongAddFormVm songForm)
    {
        var playlistDb = db.Playlists.Include(x => x.Songs).FirstOrDefault(x => x.Id == playlistId);

        if (playlistDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Playlist not found" });

        if (playlistDb.UserId != GetCurrentUserId())
            return JsonResult(StatusCodes.Status403Forbidden,
                new { Message = "Current user is not authorized to update this playlist" });

        if (playlistDb.Songs.Any(x => x.YtbId == songForm.SongYtbId))
            return JsonResult(StatusCodes.Status409Conflict,
                new { Message = "This song has already been added to this playlist" });
        
        PlaylistSong songDb = new()
        {
            YtbId = songForm.SongYtbId,
            PlaylistId = playlistDb.Id,
            AddedAt = DateTime.Now,
            PublishedAt = songForm.SongPublishedAt,
            Duration = songForm.SongDuration,
            Name = songForm.SongName,
            ArtistName = songForm.SongArtistName,
            ThumbnailUrl = songForm.SongThumbnailUrl,
            Status = songForm.SongStatus
        };

        playlistDb.Songs.Add(songDb);
        playlistDb.LastUpdatedAt = DateTime.Now;
        await db.SaveChangesAsync();

        return JsonResult(StatusCodes.Status200OK,
            new PlaylistSongVm
            {
                YtbId = songDb.YtbId,
                PlaylistId = songDb.PlaylistId,
                AddedAt = songDb.AddedAt,
                PublishedAt = songDb.PublishedAt,
                Duration = songDb.Duration,
                Name = songDb.Name,
                ArtistName = songDb.ArtistName,
                ThumbnailUrl = songDb.ThumbnailUrl,
                Status = songDb.Status
            });
    }

    /// <summary>
    /// Remove a song from one of the current user's playlists.
    /// </summary>
    /// <param name="playlistId">ID of the playlist to remove the song from.</param>
    /// <param name="songId">ID of the song to remove from the playlist.</param>
    /// <returns>Deleted song.</returns>
    [HttpDelete("{playlistId:guid}/songs/{songId}"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PlaylistSongVm>> RemoveSongAsync(Guid playlistId, string songId)
    {
        var playlistDb = db.Playlists.Include(x => x.Songs).FirstOrDefault(x => x.Id == playlistId);

        if (playlistDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Playlist not found" });

        if (playlistDb.UserId != GetCurrentUserId())
            return JsonResult(StatusCodes.Status403Forbidden,
                new { Message = "Current user is not authorized to update this playlist" });

        var songDb = playlistDb.Songs.FirstOrDefault(x => x.YtbId == songId);

        if (songDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Song not found in this playlist" });

        db.PlaylistSongs.Remove(songDb);
        playlistDb.LastUpdatedAt = DateTime.Now;
        await db.SaveChangesAsync();

        return JsonResult(StatusCodes.Status200OK,
            new PlaylistSongVm
            {
                YtbId = songDb.YtbId,
                PlaylistId = songDb.PlaylistId,
                AddedAt = songDb.AddedAt,
                PublishedAt = songDb.PublishedAt,
                Duration = songDb.Duration,
                Name = songDb.Name,
                ArtistName = songDb.ArtistName,
                ThumbnailUrl = songDb.ThumbnailUrl,
                Status = songDb.Status
            });
    }

    /// <summary>
    /// Update the status of a song contained in one of the current user's playlists.
    /// </summary>
    /// <param name="playlistId">ID of the playlist containing the song.</param>
    /// <param name="songId">ID of the song to update.</param>
    /// <param name="songStatus">Updated song statuts.</param>
    /// <returns>Updated song.</returns>
    [HttpPut("{playlistId:guid}/songs/{songId}/updateStatus"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PlaylistSongVm>> UpdateSongStatusAsync(Guid playlistId, string songId,
        [FromBody] SongStatus songStatus)
    {
        var playlistDb = db.Playlists.Include(x => x.Songs).FirstOrDefault(x => x.Id == playlistId);

        if (playlistDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Playlist not found" });

        if (playlistDb.UserId != GetCurrentUserId())
            return JsonResult(StatusCodes.Status403Forbidden,
                new { Message = "Current user is not authorized to access this playlist" });

        var songDb = playlistDb.Songs.FirstOrDefault(x => x.YtbId == songId);

        if (songDb == null)
            return JsonResult(StatusCodes.Status404NotFound, new { Message = "Song not found in this playlist" });

        songDb.Status = songStatus;
        await db.SaveChangesAsync();

        return JsonResult(StatusCodes.Status200OK,
            new PlaylistSongVm
            {
                YtbId = songDb.YtbId,
                PlaylistId = songDb.PlaylistId,
                AddedAt = songDb.AddedAt,
                PublishedAt = songDb.PublishedAt,
                Duration = songDb.Duration,
                Name = songDb.Name,
                ArtistName = songDb.ArtistName,
                ThumbnailUrl = songDb.ThumbnailUrl,
                Status = songDb.Status
            });
    }

    #endregion
}