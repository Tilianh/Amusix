namespace AmusixBackapp.Shared.ViewModels.Playlists;

/// <summary>
/// Information about a playlist.
/// </summary>
public class PlaylistInfoVm
{
    /// <summary>
    /// Playlist ID.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// Playlist name.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Playlist thumbnail.
    /// </summary>
    public string? ThumbnailUrl { get; set; }

    /// <summary>
    /// Date the playlist was created.
    /// </summary>
    public required DateTime CreatedAt { get; set; }

    /// <summary>
    /// Last date the playlist was modified.
    /// </summary>
    public required DateTime LastUpdatedAt { get; set; }

    /// <summary>
    /// Number of songs contained in the playlist.
    /// </summary>
    public int SongCount { get; set; }
}