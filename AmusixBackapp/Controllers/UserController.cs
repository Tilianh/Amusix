using AmusixBackapp.Data;
using AmusixBackapp.Data.Models;
using AmusixBackapp.Shared;
using AmusixBackapp.Shared.Classes;
using AmusixBackapp.Shared.ViewModels.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AmusixBackapp.Controllers;

/// <summary>
/// Controller to manage user and authentication.
/// </summary>
/// <param name="signInManager"></param>
/// <param name="userManager"></param>
/// <param name="db"></param>
[ApiController, Route("users")]
public class UserController(
    SignInManager<ApplicationUser> signInManager,
    UserManager<ApplicationUser> userManager,
    AppDbContext db) : AmxControllerBase
{
    #region authentication

    /// <summary>
    /// Register a new user.
    /// </summary>
    /// <param name="userForm">User to register.</param>
    [HttpPost("register"), AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status409Conflict, Description = "Username already taken")]
    [ProducesResponseType(
        StatusCodes.Status403Forbidden,
        Description = "Invalid username or insufficient password strength")]
    [ProducesResponseType(StatusCodes.Status201Created, Description = "New user registered")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> RegisterUserAsync(RegisterUserFormVm userForm)
    {
        if (!AppRegexes.UsernameRegex().IsMatch(userForm.UserName))
            return JsonResult(StatusCodes.Status403Forbidden, new { Message = "Invalid username" });

        if (await userManager.FindByNameAsync(userForm.UserName) != null)
            return JsonResult(StatusCodes.Status409Conflict, new { Message = "Username already taken" });

        ApplicationUser userDb = new()
        {
            UserName = userForm.UserName,
            DisplayName = userForm.UserDisplayName,
            Email = $"{userForm.UserName}@amusix.app",
            CreatedAt = DateTime.Now
        };

        await using var transaction = await db.Database.BeginTransactionAsync();

        var result = await userManager.CreateAsync(userDb, userForm.Password);

        foreach (var error in result.Errors)
        {
            if (error.Code.Contains("password", StringComparison.CurrentCultureIgnoreCase))
            {
                return JsonResult(StatusCodes.Status403Forbidden,
                    new { Message = "Insufficient password strength" });
            }
            return JsonResult(StatusCodes.Status500InternalServerError, new { Error = error });
        }

        await userManager.AddToRoleAsync(userDb, AppRoles.User);

        await transaction.CommitAsync();
        return JsonResult(StatusCodes.Status201Created, new { Message = "New user registered" });
    }

    /// <summary>
    /// Try to log in a user.
    /// </summary>
    /// <param name="userForm">User to log in.</param>
    /// <returns>The corresponding access token if the authentication is successful.</returns>
    [HttpPost("login"), AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status404NotFound, Description = "User not found")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized, Description = "Invalid password")]
    [ProducesResponseType(StatusCodes.Status200OK, Description = "Return corresponding access token")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> LoginUserAsync(LoginUserFormVm userForm)
    {
        var userDb = await userManager.FindByNameAsync(userForm.UserName);

        if (userDb == null) return JsonResult(StatusCodes.Status404NotFound, new { Message = "User not found" });

        signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;
        var result = await signInManager.PasswordSignInAsync(userDb, userForm.Password, false, false);

        return result.Succeeded
            ? new EmptyResult()
            : JsonResult(StatusCodes.Status401Unauthorized, new { Message = "Invalid password" });
    }

    #endregion

    #region users

    /// <summary>
    /// Get the currently authenticated user data.
    /// </summary>
    /// <returns>Current user data.</returns>
    [HttpGet("current"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK, Description = "Return current user data", Type = typeof(UserInfoVm))]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserInfoVm>> GetCurrentUserAsync()
    {
        var userDb = (await userManager.GetUserAsync(User))!;
        return JsonResult(StatusCodes.Status200OK,
            new UserInfoVm
            {
                Id = userDb.Id,
                UserName = userDb.UserName!,
                DisplayName = userDb.DisplayName,
                CreatedAt = userDb.CreatedAt
            });
    }

    /// <summary>
    /// Update current user's password and sign them out.
    /// </summary>
    /// <param name="userForm">User password update form.</param>
    [HttpPut("current/updatePassword"), Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status403Forbidden,
        Description = "Old password invalid or new password is too weak")]
    [ProducesResponseType(
        StatusCodes.Status409Conflict,
        Description = "New password and old password can't be the same")]
    [ProducesResponseType(StatusCodes.Status200OK, Description = "Password updated")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdateCurrentUserPasswordAsync(UserPasswordUpdateFormVm userForm)
    {
        var userDb = (await userManager.GetUserAsync(User))!;

        if (!await userManager.CheckPasswordAsync(userDb, userForm.OldPassword))
            return JsonResult(StatusCodes.Status403Forbidden, new { Message = "Old password is not valid" });

        var result = await userManager.ChangePasswordAsync(userDb, userForm.OldPassword, userForm.NewPassword);

        foreach (var error in result.Errors)
        {
            if (error.Code.Contains("password", StringComparison.CurrentCultureIgnoreCase))
            {
                return JsonResult(StatusCodes.Status403Forbidden,
                    new { Message = "Insufficient password strength" });
            }
            return JsonResult(StatusCodes.Status500InternalServerError, new { Error = error });
        }

        if (userForm.OldPassword == userForm.NewPassword)
            return JsonResult(StatusCodes.Status409Conflict,
                new { Message = "New password and old password can't be the same" });

        return JsonResult(StatusCodes.Status200OK, new { Message = "Password updated" });
    }

    #endregion
}