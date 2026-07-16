# Amusix Backend Application

## Stack

### Main stack

* [.NET Core 10](https://dotnet.microsoft.com/download/dotnet/10.0) (Web API)
* [Entity Framework Core 10](https://learn.microsoft.com/ef/)

### External NuGet dependencies

* [`Npgsql.EntityFrameworkCore.PostgreSQL` (10.0.3)](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/10.0.3):
  PostgreSQL database connection
* [`Bogus` (35.6.5)](https://www.nuget.org/packages/Bogus/35.6.5): fake data seeding
* [`Google.Apis.YouTube.v3` (1.75.0.4205)](https://www.nuget.org/packages/Google.Apis.YouTube.v3/1.75.0.4205):
  interactions with YouTube API
* Identity (authentication / security management):
    * [`Microsoft.AspNetCore.Identity.EntityFrameworkCore` (10.0.9)](https://www.nuget.org/packages/Microsoft.AspNetCore.Identity.EntityFrameworkCore/10.0.9)
    * [`Microsoft.AspNetCore.Identity.UI` (10.0.9)](https://www.nuget.org/packages/Microsoft.AspNetCore.Identity.UI/10.0.9)
* Swagger (API documentation and testing):
    * [`Swashbuckle.AspNetCore.Filters` (10.0.1)](https://www.nuget.org/packages/Swashbuckle.AspNetCore.Filters/10.0.1)
    * [`Swashbuckle.AspNetCore.Swagger` (10.2.3)](https://www.nuget.org/packages/Swashbuckle.AspNetCore.Swagger/10.2.3)
    * [`Swashbuckle.AspNetCore.SwaggerGen` (10.2.3)](https://www.nuget.org/packages/Swashbuckle.AspNetCore.SwaggerGen/10.2.3)
    * [`Swashbuckle.AspNetCore.SwaggerUI` (10.2.3)](https://www.nuget.org/packages/Swashbuckle.AspNetCore.SwaggerUI/10.2.3)

## File structure

* `Controllers/`: controllers defining API routes
    * User management
    * Playlist management
    * Song researching
* `Data/`:
    * `Migrations/`: ordered Entity Framework migrations
    * `Models/`: entities implementing the database model
        * Users
        * Playlists
        * Songs
    * `AppDbContext.cs`: database context configuration
    * `DataSeeder.cs`: fake data seeder
* `Shared/`: shared resources (view models, classes, constants, etc.)
* `appsettings(.*).json`: configuration files
* `Program.cs`: application startup file

## Startup (for development)

### Setup

1. Install .NET Core (if necessary)

2. If you don't have any PostgreSQL instance to host the development database, you can create one inside a Docker
   container by running the following command in a terminal:
    ```shell
    $ docker run --name postgres-dev -e POSTGRES_PASSWORD=<user> -e POSTGRES_USER=<password> -d postgres
    ```
   Replace `<user>` and `<password>` with the database credentials of your choice

3. Create a copy of the `appsettings.json` file as `appsettings.Development.json`

4. Provide a value for the following fields in the created file:
    * `ConnectionStrings`:
        * `Default`: application PostgreSQL database connection string
            * Specify the user and password credentials you provided to create the containerized database
            * Specify `localhost` for the host and `5432` for the port
    * `AllowedOrigins`: origins allowed to send request to the API
        * Specify `http://localhost:4200`
    * `SeedDatabase`: if the database should be filled with fake data
    * `YouTubeApi`:
        * `ApiKey`: Google Cloud (YouTube) [API key](https://docs.cloud.google.com/docs/authentication/api-keys)
        * `ApplicationName`: Google Cloud application name

5. Amusix's backend application uses Entity Framework ORM to implement the database model via entities and migrations

   Run the command bellow at the backend project's root in a terminal to :
    1. Create the Amusix database if it doesn't exist yet
    2. Apply the latest migrations to the database

    ```shell
    dotnet ef database update
    ```

> [!CAUTION]
> As some migrations may cause data loss when being applied, it is advised to make data backups before each database update.

### Run

Run the following command at the backend project's root in a terminal to launch the application in a local development environment:

```shell
dotnet run
```

Access URL: http://localhost:5211

## API documentation and testing with Swagger

### Overview

When launching the application in a local development environment, all available routes implemented by the controllers are documented and can be tested with the configured Swagger interface.

![swagger UI](../docs/images/swagger.png)

Default access URL: http://localhost:5211/docs

### Authenticate to use private routes

Some routes are private and can't be accessed without authentication.

1. Create a user account via the `/users/register` route (or use an existing one for the up-coming step)

2. Use your credential to log in via the `/users/login` route -> If the authentication succeed, a private `accessToken` will be returned

3. Click the "Authorize" button at the top right of the page

4. In the displayed modal, enter `Bearer` followed by a blank space followed by the previously returned token, than click "Authorize" and close the modal

5. You will now be able to request private routes (according to your user permissions)