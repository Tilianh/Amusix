using System.ComponentModel.DataAnnotations;

namespace AmusixBackapp.Shared.ViewModels.Users;

/// <summary>
/// Form to register a user.
/// </summary>
public class RegisterUserFormVm
{
    /// <summary>
    /// Unique username.
    /// </summary>
    [Required, MaxLength(100)]
    public required string UserName { get; set; }

    /// <summary>
    /// User display name.
    /// </summary>
    [MaxLength(100)]
    public string? UserDisplayName { get; set; }

    /// <summary>
    /// User password.
    /// </summary>
    [Required, MaxLength(100)]
    public required string Password { get; set; }
}