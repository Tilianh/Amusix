using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace AmusixBackapp.Shared.Classes;

/// <summary>
/// Amusix controller base class.
/// </summary>
public abstract class AmxControllerBase : Controller
{
    private static readonly JsonSerializerOptions JsonSerializerOptions =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    
    /// <summary>
    /// Get current user ID.
    /// </summary>
    /// <returns>Current user ID if found, else null.</returns>
    protected Guid? GetCurrentUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return idClaim != null ? Guid.Parse(idClaim.Value) : null;
    }

    /// <summary>
    /// Initialize an HTTP response JSON object.
    /// </summary>
    /// <param name="code">HTTP return code.</param>
    /// <param name="content">JSON serializable body content.</param>
    /// <returns>A simple HTTP JSON return object.</returns>
    protected static ContentResult JsonResult<T>(int code, T content)
    {
        return new ContentResult
        {
            StatusCode = code,
            ContentType = "application/json",
            Content = JsonSerializer.Serialize(content, JsonSerializerOptions)
        };
    }
}