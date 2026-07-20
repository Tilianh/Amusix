using System.ComponentModel.DataAnnotations;

namespace AmusixBackapp.Shared.ViewModels.Users;

/// <summary>
/// User password update form.
/// </summary>
public class UserPasswordUpdateFormVm
{
    /// <summary>
    /// Old user password.
    /// </summary>
    [Required, MaxLength(100)]
    public required string OldPassword { get; set; }
    
    /// <summary>
    /// New user password.
    /// </summary>
    [Required, MaxLength(100)]
    public required string NewPassword { get; set; }
}