# Amusix Frontend Application

## Stack

### Main stack

* [Node.js 24](https://nodejs.org/fr)
* [Angular 21](https://v21.angular.dev/overview) (+ TypeScript)
* [Bootstrap 5.3](https://getbootstrap.com/docs/5.3) (+ SCSS)

### External NPM dependencies

* [`universal-cookie` (8.1.2)](https://www.npmjs.com/package/universal-cookie/v/8.1.2): browser cookie management
* [`youtube-player` (5.6.0)](https://www.npmjs.com/package/youtube-player/v/5.6.0): YouTube player integration and interactions

## File structure

* `src/`:
  * `app/`:
    * `core/`: core components
    * `features/`:
      * `auth/`: authentication resources
        * Login form
        * Register form
      * `home-page/`: application home-page
      * `playlists/`: playlist resources
        * Modal to add song to a playlist
        * Current user's playlists page
        * Playlist consultation / song listing page
        * Playlist editing modal
        * Playlist listing item
        * Playlist selection item
        * Playlist song listing item
      * `songs/`: songs resources
        * Search result song listing item
        * Song player
        * Song search bar
        * Song search results page
      * `user-profile/`: user profile resources
        * Current user's profile page
        * Password changing modal
    * `shared/`: shared / reusable resources
    * `app.routes.ts`: page routes
  * `environment/`: environment files
  * `styles/`: styling sheets

> [!NOTE]
> Resource / feature directories are structured as follows:
> * `components/`: Angular component files (HTML, SCSS and TS)
> * `models/`: data models (user, playlist, song, etc.)
> * `services/`: services (component communication, API calls, etc.)

## Startup (for development)

### Setup

1. Install Node.js (if necessary)

2. Install all project dependencies by running the following command at the frontend project's root in a terminal:
   ```shell
    npm i
    ```

### Run

Run the following command at the frontend project's root in a terminal to launch the application in a local development environment:

```shell
ng serve
```

Access URL: http://localhost:4200
