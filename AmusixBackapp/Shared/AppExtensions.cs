namespace AmusixBackapp.Shared;

/// <summary>
/// App class extensions.
/// </summary>
public static class AppExtensions
{
    /// <summary>
    /// <see cref="string"/> extensions.
    /// </summary>
    /// <param name="str"></param>
    extension(string str)
    {
        /// <summary>
        /// Convert a duration formatted in a string as ISO-8601 in the format PT#H#M#S
        /// (first # = hours, second # = minutes, third # = secondes) into a <see cref="TimeSpan"/>.
        /// </summary>
        /// <returns>Corresponding time span or null if the string couldn't be formatted.</returns>
        public TimeSpan? ToTimeSpan()
        {
            var m = AppRegexes.Iso8601Regex().Match(str);
            if (m.Success)
            {
                return new TimeSpan(
                    hours: m.Groups.TryGetValue("hours", out var hourGroup) &&
                           int.TryParse(hourGroup.Value, out var hours)
                        ? hours
                        : 0,
                    minutes: m.Groups.TryGetValue("minutes", out var minuteGroup) &&
                             int.TryParse(minuteGroup.Value, out var minutes)
                        ? minutes
                        : 0,
                    seconds: m.Groups.TryGetValue("seconds", out var secondGroup) &&
                             int.TryParse(secondGroup.Value, out var seconds)
                        ? seconds
                        : 0);
            }
            return null;
        }
    }
}