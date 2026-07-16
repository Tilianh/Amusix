<picture>
    <img alt="banner" src="docs/images/banner.jpg" />
</picture>
<br>
<br>

# Amusix

**Welcome to Amusix's GitHub repository. Here you'll find everything you need to know about the application's code and how you can contribute to improve it!**

## What is Amusix?

Amusix in an application powered by the YouTube API to listen to and share music playlists with your friends.

It is based on .NET 10 and Angular 21.

## Architecture

### File structure

* `AmusixBackapp/`: .NET backend application
* `AmusixFrontapp/`: Angular frontend application
* `docs/`: repo documentation
* `proxy/`: Nginx proxy
* `tests/`: Cypress automatized tests

## Startup (with Docker)

> [!NOTE]
> Each of the `AmusixBackapp/`, `AmusixFrontapp/` and `tests/` directories contain a `README.md` file at their root with step-by-step guides on how to properly set up and launch each corresponding code part individually.

### Setup

1. Install Docker / [Docker Desktop](https://www.docker.com/products/docker-desktop/) (if necessary)

2. Create a `.env` file at the repo directory's root with the following content
    ``` apacheconf
    DATABASE_USER=
    DATABASE_PASSWORD=
    YOUTUBE_API_KEY=
    YOUTUBE_API_APP_NAME=
    ```

3. Provide a values for the following fields in the created file:
    * `DATABASE_USER`: database user (of your choice)
    * `DATABASE_PASSWORD`: database password (of your choice)
    * `YOUTUBE_API_KEY`: Google Cloud (YouTube) [API key](https://docs.cloud.google.com/docs/authentication/api-keys)
    * `YOUTUBE_API_APP_NAME`: Google Cloud application name

### Run

Run the following command at the repo directory's root in a terminal to launch the dockerized application:

```shell
docker-compose up -d --build
```

> [!NOTE]
> The containerized application will run in production mode (even when ran in a local environment).

Interface access URL: http://localhost

API access URL: http://localhost/api