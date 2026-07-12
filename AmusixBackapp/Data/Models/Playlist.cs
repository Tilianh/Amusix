using System.ComponentModel.DataAnnotations;

namespace AmusixBackapp.Data.Models;

/// <summary>
/// Song playlist entity.
/// </summary>
public class Playlist
{
    /// <summary>
    /// Playlist ID.
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Playlist name.
    /// </summary>
    [Required, MaxLength(100)]
    public required string Name { get; set; }
    
    /// <summary>
    /// ID of the user the playlist belongs to.
    /// </summary>
    [Required]
    public Guid UserId { get; set; }
    
    /// <summary>
    /// User the playlist belongs to.
    /// </summary>
    public virtual ApplicationUser? User { get; set; }
    
    /// <summary>
    /// Date the playlist was created.
    /// </summary>
    [Required]
    public required DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Last date the playlist was modified. 
    /// </summary>
    [Required]
    public required DateTime LastUpdatedAt { get; set; }

    /// <summary>
    /// Songs contained in the playlist.
    /// </summary>
    public virtual List<PlaylistSong> Songs { get; set; } = new();
}