using AmusixBackapp.Shared.Enums;

namespace AmusixBackapp.Shared.ViewModels.Songs;

/// <summary>
/// Song contained in a playlist.
/// </summary>
public class PlaylistSongVm
{
    /// <summary>
    /// Song YouTube ID.
    /// </summary>
    public required string YtbId { get; set; }
    
    /// <summary>
    /// ID of the playlist the song is contained in.
    /// </summary>
    public required Guid PlaylistId { get; set; }
    
    /// <summary>
    /// Date the song was saved in the playlist.
    /// </summary>
    public required DateTime AddedAt { get; set; }
    
    /// <summary>
    /// Date the song was published.
    /// </summary>
    public required DateTime PublishedAt { get; set; }
    
    /// <summary>
    /// Song duration (in seconds).
    /// </summary>
    public required int Duration { get; set; }
    
    /// <summary>
    /// Song name.
    /// </summary>
    public required string Name { get; set; }
    
    /// <summary>
    /// Name of the artist who published the song.
    /// </summary>
    public required string ArtistName { get; set; }
    
    /// <summary>
    /// URL of the song's thumbnail.
    /// </summary>
    public required string ThumbnailUrl { get; set; }
    
    /// <summary>
    /// Song status.
    /// </summary>
    public required SongStatus Status { get; set; }
}