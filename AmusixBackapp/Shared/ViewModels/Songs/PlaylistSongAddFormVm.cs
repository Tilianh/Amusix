using AmusixBackapp.Shared.Enums;

namespace AmusixBackapp.Shared.ViewModels.Songs;

/// <summary>
/// Form to add a song to a playlist.
/// </summary>
public class PlaylistSongAddFormVm
{
    /// <summary>
    /// Song YouTube ID.
    /// </summary>
    public required string SongYtbId { get; set; }
    
    /// <summary>
    /// Date the song was published.
    /// </summary>
    public required DateTime SongPublishedAt { get; set; }
    
    /// <summary>
    /// Song duration (in seconds).
    /// </summary>
    public required int SongDuration { get; set; }
    
    /// <summary>
    /// Song name.
    /// </summary>
    public required string SongName { get; set; }
    
    /// <summary>
    /// Name of the artist who published the song.
    /// </summary>
    public required string SongArtistName { get; set; }
    
    /// <summary>
    /// URL of the song's thumbnail.
    /// </summary>
    public required string SongThumbnailUrl { get; set; }
    
    /// <summary>
    /// Song status.
    /// </summary>
    public required SongStatus SongStatus { get; set; }
}