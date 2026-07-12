using System.ComponentModel.DataAnnotations;

namespace AmusixBackapp.Shared.ViewModels.Users;

/// <summary>
/// User log in form.
/// </summary>
public class LoginUserFormVm
{
    /// <summary>
    /// Unique username.
    /// </summary>
    [Required, MaxLength(100)]
    public required string UserName { get; set; }

    /// <summary>
    /// User password.
    /// </summary>
    [Required, MaxLength(100)]
    public required string Password { get; set; }
}