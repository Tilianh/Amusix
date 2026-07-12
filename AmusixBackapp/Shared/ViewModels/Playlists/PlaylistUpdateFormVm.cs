using System.ComponentModel.DataAnnotations;

namespace AmusixBackapp.Shared.ViewModels.Playlists;

/// <summary>
/// Form to update a playlist.
/// </summary>
public class PlaylistUpdateFormVm
{
    /// <summary>
    /// Playlist name.
    /// </summary>
    [Required, MaxLength(100)]
    public required string PlaylistName { get; set; }
}