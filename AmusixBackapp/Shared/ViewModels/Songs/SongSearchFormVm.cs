using System.ComponentModel.DataAnnotations;

namespace AmusixBackapp.Shared.ViewModels.Songs;

/// <summary>
/// Form to search for songs.
/// </summary>
public class SongSearchFormVm
{
    /// <summary>
    /// Search songs from the given text.
    /// </summary>
    [MaxLength(100)]
    public string? SearchText { get; set; }
}