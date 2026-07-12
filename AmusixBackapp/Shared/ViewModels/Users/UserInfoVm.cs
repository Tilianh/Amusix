namespace AmusixBackapp.Shared.ViewModels.Users;

/// <summary>
/// Information about a user.
/// </summary>
public class UserInfoVm
{
    /// <summary>
    /// User ID.
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// User display name.
    /// </summary>
    public string? DisplayName { get; set; }
    
    /// <summary>
    /// Unique username.
    /// </summary>
    public required string UserName { get; set; }
    
    /// <summary>
    /// The date the user was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}