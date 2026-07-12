using Google.Apis.YouTube.v3;

namespace AmusixBackapp.Shared.Classes;

/// <summary>
/// YouTube API service.
/// </summary>
public class YouTubeApiService : YouTubeService
{
    /// <summary>
    /// Initialize a YouTube API service.
    /// </summary>
    /// <param name="configuration"></param>
    public YouTubeApiService(IConfiguration configuration) : base(GetInitializer(configuration))
    {
    }

    /// <summary>
    /// Return an initializer for the class.
    /// </summary>
    /// <param name="configuration">App configuration.</param>
    /// <returns>An initializer or null if the initializer couldn't be created.</returns>
    private static Initializer? GetInitializer(IConfiguration configuration)
    {
        var ytbApiConfSection = configuration.GetSection("YouTubeApi");
        if (ytbApiConfSection.Exists())
        {
            return new Initializer
            {
                ApiKey = ytbApiConfSection.GetValue<string>("ApiKey"),
                ApplicationName = ytbApiConfSection.GetValue<string>("ApplicationName")
            };
        }
        return null;
    }
}