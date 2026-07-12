using System.Text.RegularExpressions;

namespace AmusixBackapp.Shared;

/// <summary>
/// App regexes.
/// </summary>
public static partial class AppRegexes
{
    /// <summary>
    /// Get regex for ISO8601 duration format. 
    /// </summary>
    [GeneratedRegex(@"PT(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?(?:(?<seconds>\d+)S)?")]
    public static partial Regex Iso8601Regex();
}