using AmusixBackapp.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AmusixBackapp.Data;

/// <summary>
/// Application DB context.
/// </summary>
/// <param name="options"></param>
public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    #region configuration

    static AppDbContext()
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    #endregion

    #region database sets

    /// <summary>
    /// Song playlists.
    /// </summary>
    public DbSet<Playlist> Playlists { get; set; }

    /// <summary>
    /// Songs contained in playlists.
    /// </summary>
    public DbSet<PlaylistSong> PlaylistSongs { get; set; }

    #endregion
}