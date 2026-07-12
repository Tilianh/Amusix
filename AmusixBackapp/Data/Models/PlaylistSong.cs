using System.ComponentModel.DataAnnotations;
using AmusixBackapp.Shared.Enums;
using Microsoft.EntityFrameworkCore;

namespace AmusixBackapp.Data.Models;

/// <summary>
/// Identity for a song contained in a playlist.
/// </summary>
[PrimaryKey(nameof(YtbId), nameof(PlaylistId))]
public class PlaylistSong
{
    /// <summary>
    /// Song YouTube ID.
    /// </summary>
    [MaxLength(11)]
    public required string YtbId { get; set; }
    
    /// <summary>
    /// ID of the playlist the song is in.
    /// </summary>
    [Required]
    public Guid PlaylistId { get; set; }
    
    /// <summary>
    /// Playlist the song is in.
    /// </summary>
    public virtual Playlist? Playlist { get; set; }
    
    /// <summary>
    /// Date the song was saved in the playlist.
    /// </summary>
    [Required]
    public required DateTime AddedAt { get; set; }
    
    /// <summary>
    /// Date the song was published.
    /// </summary>
    [Required]
    public required DateTime PublishedAt { get; set; }
    
    /// <summary>
    /// Song duration (in seconds).
    /// </summary>
    [Required]
    public required int Duration { get; set; }
    
    /// <summary>
    /// Song name.
    /// </summary>
    [Required, MaxLength(250)]
    public required string Name { get; set; }
    
    /// <summary>
    /// Name of the artist who published the song.
    /// </summary>
    [Required, MaxLength(100)]
    public required string ArtistName { get; set; }
    
    /// <summary>
    /// URL of the song's thumbnail.
    /// </summary>
    [Required, MaxLength(250)]
    public required string ThumbnailUrl { get; set; }
    
    /// <summary>
    /// Song status.
    /// </summary>
    public required SongStatus Status { get; set; }
}