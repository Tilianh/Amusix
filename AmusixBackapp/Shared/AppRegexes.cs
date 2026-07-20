using System.Text.RegularExpressions;

namespace AmusixBackapp.Shared;

/// <summary>
/// App regexes.
/// </summary>
public static partial class AppRegexes
{
    /// <summary>
    /// Get regex to ensure application username format.
    /// </summary>
    [GeneratedRegex(@"^(?=.*[a-z])(?=.*[0-9\-_]?)(\S){5,256}$")]
    public static partial Regex UsernameRegex();
    
    /// <summary>
    /// Get regex for ISO8601 duration format. 
    /// </summary>
    [GeneratedRegex(@"PT(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?(?:(?<seconds>\d+)S)?")]
    public static partial Regex Iso8601Regex();
}