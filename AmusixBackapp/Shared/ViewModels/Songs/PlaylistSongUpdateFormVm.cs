using AmusixBackapp.Shared.Enums;

namespace AmusixBackapp.Shared.ViewModels.Songs;

/// <summary>
/// Form to update a song from a playlist. */
/// </summary>
public class PlaylistSongUpdateFormVm
{
    /// <summary>
    /// Song status.
    /// </summary>
    public required SongStatus SongStatus { get; set; }
}