# Amusix backend application

## Stack

<a href="https://dotnet.microsoft.com/download/dotnet"><img alt=".NET Core" src="https://img.shields.io/badge/.NET-512BD4.svg?style=for-the-badge&logo=dotnet&logoColor=white"/></a>
<a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white"/></a>

Amusix's backend application also relies on the [Entity Framework](https://learn.microsoft.com/aspnet/entity-framework) ORM to implement the database model via entities and migrations.

> [!NOTE]
> Check the `AmusixBackapp.csproj` file at the project's root to get an overview of all dependencies and versions.

## Project structure

```
Controllers
Data
├───Migrations
└───Models
Shared
```

* `Controllers/`: controllers implementing business logics as public and private API endpoints
* `Data/Migrations/`: [Entity Framework](https://learn.microsoft.com/aspnet/entity-framework) database migrations
* `Data/Models/`: database model implementation as entities
* `Shared/`: shared resources
* `appsettings.*.json`: configuration files

## Startup (for development)

### Setup

1. Install [.NET Core](https://dotnet.microsoft.com/download/dotnet) (if necessary)

2. Set up a [PostgreSQL](https://www.postgresql.org) instance to host the database (you can quickly set up a [dockerized database](https://hub.docker.com/_/postgres#start-a-postgres-instance))

3. At the project's root, create a copy of the `appsettings.json` file as `appsettings.Development.json`

4. Specify a value for each of the following fields in the created file:
   * `ConnectionStrings:Default`: connection string to connect to your PostgreSQL instance
   * `AllowedOrigins`: origins allowed to send request to the API → specify `http://localhost:4200`
   * `SeedDatabase`: if set to `true`, the database will be filled with fake generated data (on startup)
   * `YouTubeApi:ApiKey`: your Google Cloud [API key](https://docs.cloud.google.com/docs/authentication/api-keys)
   * `YouTubeApi:ApplicationName`: your Google Cloud application name

5. Create the Amusix database if it doesn't exist and apply the latest migrations by running the following command at the project's root in a terminal:

    ```shell
    dotnet ef database update
    ```

> [!CAUTION]
> As some migrations may cause data loss when being applied, it is advised to make data backups before each database update.

### Run

Launch the application in a local development server by running the following command at the project's root in a terminal:

```shell
dotnet run
```

> Access URL: http://localhost:5211

## Swagger UI

When launching the application in a local development environment, all routes implemented by each controller are documented and can be tested via the configured Swagger interface.

<img alt="swagger UI" src="../docs/images/screenshots/swagger.png" style="width: 750px"/>

> Access URL: http://localhost:5211/docs

### Authenticate to use private routes

Some routes are private and can't be accessed without authentication.

1. Create a user account via the `/users/register` route

2. Use your credential to log in via the `/users/login` route -> if the authentication succeed, a private `accessToken` will be returned

3. Click the "Authorize" button at the top right of the page

4. In the displayed modal, enter `Bearer` followed by a blank space followed by the previously returned token, then click "Authorize" and close the modal

5. You will now be able to send request to private routes

> [!NOTE]
> Some routes might remain inaccessible depending on the permissions associated to your registered account.