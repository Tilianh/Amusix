using AmusixBackapp.Data.Models;
using AmusixBackapp.Shared.Enums;
using Bogus;

namespace AmusixBackapp.Data;

/// <summary>
/// Data seeder to populate the database with fake data.
/// </summary>
public class DataSeeder
{
    /// <summary>
    /// Execute the data seeder to populate the database.
    /// </summary>
    /// <param name="db"></param>
    public static void Execute(AppDbContext db)
    {
        SeedDatabase(db);
        db.SaveChanges();
    }
    
    /// <summary>
    /// Execute the data seeder to populate the database.
    /// </summary>
    /// <param name="db"></param>
    public static async Task ExecuteAsync(AppDbContext db)
    {
        SeedDatabase(db);
        await db.SaveChangesAsync();
    }

    /// <summary>
    /// Seed the database with fake data.
    /// </summary>
    /// <param name="db"></param>
    private static void SeedDatabase(AppDbContext db)
    {
        Faker faker = new();
        var userIds = db.Users.Select(x => x.Id).ToList();
        
        if (userIds.Count > 0 && !db.Playlists.Any())
        {
            List<Playlist> playlistsToAdd = [];
            for (var i = 0; i < 100; i++)
            {
                List<PlaylistSong> songs = [];
                for (var j = 0; j < faker.Random.Number(1, 10); j++)
                {
                    songs.Add(new PlaylistSong
                    {
                        YtbId = faker.Random.Hash(11),
                        Name = faker.Lorem.Sentence(),
                        ArtistName = faker.Name.FullName(),
                        Duration = faker.Random.Number(60, 500),
                        Status = SongStatus.Valid,
                        AddedAt = faker.Date.Past(5),
                        PublishedAt = faker.Date.Past(10),
                        ThumbnailUrl = faker.Image.PicsumUrl()
                    });
                }
                
                playlistsToAdd.Add(new Playlist
                {
                    Id = faker.Random.Guid(),
                    Name = faker.Lorem.Sentence(),
                    UserId = faker.PickRandom(userIds),
                    CreatedAt = faker.Date.Past(5),
                    LastUpdatedAt = faker.Date.Past(5),
                    Songs = songs
                });
            }
            db.Playlists.AddRange(playlistsToAdd);
        }
    }   
}