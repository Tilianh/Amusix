using AmusixBackapp.Shared;
using AmusixBackapp.Shared.Classes;
using AmusixBackapp.Shared.Classes.Pagination;
using AmusixBackapp.Shared.ViewModels.Songs;
using Google.Apis.YouTube.v3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmusixBackapp.Controllers;

/// <summary>
/// Controller to manage songs.
/// </summary>
/// <param name="ytbApiService"></param>
[ApiController, Route("songs")]
public class SongController(YouTubeApiService ytbApiService) : AmxControllerBase
{
    /// <summary>
    /// Search for songs on the YouTube API.
    /// </summary>
    /// <param name="songSearchForm">Song search criteria.</param>
    /// <param name="pageToken">Returned items page token.</param>
    /// <returns>Songs corresponding to the search from the YouTube API.</returns>
    [HttpPost("search"), HttpPost("search/{pageToken}")]
    [Authorize(Roles = AppRoles.User)]
    [ProducesResponseType(
        StatusCodes.Status200OK,
        Description = "Return corresponding paginated songs",
        Type = typeof(PaginatedListPage<SearchResultSongVm>))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PaginatedListPage<SearchResultSongVm>>> SearchSongsAsync(
        SongSearchFormVm songSearchForm,
        string? pageToken = null)
    {
        var searchRequest = ytbApiService.Search.List("snippet");

        // Search criteria
        searchRequest.Q = songSearchForm.SearchText;
        searchRequest.EventType = SearchResource.ListRequest.EventTypeEnum.None;
        searchRequest.Type = "video";
        //searchRequest.VideoCategoryId = "10"; // Music category
        searchRequest.Order = SearchResource.ListRequest.OrderEnum.Relevance;
        searchRequest.MaxResults = AppConstants.DataPageSize;
        searchRequest.PageToken = pageToken;

        // Search songs on YouTube API
        var searchResult = (await searchRequest.ExecuteAsync())!;
        var totalResultCount = searchResult.PageInfo.TotalResults ?? 0;

        var videoRequest = ytbApiService.Videos.List("snippet,contentDetails");
        videoRequest.Id = searchResult.Items.Select(x => x.Id.VideoId).ToArray();

        // Get corresponding video data
        var videoData = (await videoRequest.ExecuteAsync())!;

        var songs = searchResult.Items
            .SelectMany(x =>
                videoData.Items
                    .Where(y => y.Id == x.Id.VideoId)
                    .Select(y => new SearchResultSongVm
                    {
                        YtbId = y.Id,
                        Name = y.Snippet.Title,
                        PublishedAt = y.Snippet.PublishedAtDateTimeOffset?.DateTime ?? DateTime.MinValue,
                        Duration = (int)(y.ContentDetails.Duration.ToTimeSpan()?.TotalSeconds ?? 0),
                        ArtistName = y.Snippet.ChannelTitle,
                        ThumbnailUrl = y.Snippet.Thumbnails.Standard?.Url ?? ""
                    }))
            .ToList();

        return JsonResult(StatusCodes.Status200OK,
            new PaginatedListPage<SearchResultSongVm>(
                songs,
                pageToken == null
                    ? // Total result count = first page size if no next page token provided
                    searchResult.NextPageToken != null ? totalResultCount : songs.Count
                    : totalResultCount,
                pageToken,
                searchResult.PrevPageToken,
                searchResult.NextPageToken));
    }
}