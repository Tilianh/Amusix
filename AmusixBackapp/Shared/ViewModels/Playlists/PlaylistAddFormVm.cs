using System.ComponentModel.DataAnnotations;
using AmusixBackapp.Shared.Enums;

namespace AmusixBackapp.Shared.ViewModels.Playlists;

/// <summary>
/// Form to add a playlist containing a song.
/// </summary>
public class PlaylistAddFormVm
{
    /// <summary>
    /// Playlist name.
    /// </summary>
    [Required, MaxLength(100)]
    public required string PlaylistName { get; set; }

    /// <summary>
    /// YouTube ID of the contained song.
    /// </summary>
    [Required, MaxLength(11)]
    public required string SongYtbId { get; set; }

    /// <summary>
    /// Date the song was published.
    /// </summary>
    [Required]
    public required DateTime SongPublishedAt { get; set; }

    /// <summary>
    /// Song duration (in seconds).
    /// </summary>
    [Required]
    public required int SongDuration { get; set; }

    /// <summary>
    /// Song name.
    /// </summary>
    [Required, MaxLength(250)]
    public required string SongName { get; set; }

    /// <summary>
    /// Name of the artist who published the song.
    /// </summary>
    [Required, MaxLength(100)]
    public required string SongArtistName { get; set; }

    /// <summary>
    /// URL of the song's thumbnail.
    /// </summary>
    [Required, MaxLength(250)]
    public required string SongThumbnailUrl { get; set; }

    /// <summary>
    /// Song status.
    /// </summary>
    [Required]
    public required SongStatus SongStatus { get; set; }
}