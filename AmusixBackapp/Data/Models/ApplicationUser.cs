using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace AmusixBackapp.Data.Models;

/// <summary>
/// Application user entity.
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    /// <summary>
    /// User display name.
    /// </summary>
    [MaxLength(100)]
    public string? DisplayName { get; set; }
    
    /// <summary>
    /// Date the user was created.
    /// </summary>
    [Required]
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// User's song playlists.
    /// </summary>
    public virtual List<Playlist> Playlists { get; set; } = new();
}