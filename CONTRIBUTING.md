# Contributing guidelines

Wanna contribute to the Amusix development journey? Take a look at the project repository guidelines described here!

## Basic repository guidelines

This section describes basic guidelines to keep this repository alive and clean.

### Issues

Any bug or vulnerability to report? An idea of feature you'd like to see in Amusix? [Create a new bug report or a feature request in GitHub.](https://github.com/Tilianh/Amusix/issues/new)

## Code contribution

Wanna put your hands in Amusix's code? This section describes guidelines for code contribution.

### Branche strategy

If you want to contribute to Amusix's code, you first need to know how this repository works, how do you create branches and name them, where and how you merge your code so it can be included in a new version of the application.

This section is here to help you quickly understand the branch strategy that was set up for this repository.

#### Naming

Reserved branch names:

* `main`:
  * Latest code version
  * Protected (cannot push anything on it)
* `release`:
  * To prepare a new release
  * Only these branches can be merged into 'main'

You can name any other branche however you want. Just be sure their name is explicit enough!

#### Release workflow

Just so you know, here are the steps to draft a new release of the application:

1. Create a `release` branch from `main`

2. Merge all branches corresponding to features and fixes to include in the version into the created `release` branch

3. Increment the application version in the `package.json` file at the root of the frontend application `AmusixFrontapp` ([check how to number a version](#version-numbering))

4. When everything is ready, merge the `release` branch into `main` via a pull request

When the merge is triggered from the created pull request, the following steps will be automatically executed:

1. Frontend documentation generation and deployment in GitHub Pages

2. Docker images building and pushing in Docker Hub

3. Application deployment on the production server via the Docker container architecture

4. New GitHub release drafting

#### Version numbering

Here is an explanation of how the application versions are numbered.

*Example:* `v1.2.5`

* First number (`1`):
** Major version number
** Increased only when the version includes a big update that globally changes the application
* Second number (`2`):
** Evolution number
** Increased when the version includes new features
* Third number (`5`):
** Fix number
** Increased when the version only includes bug fixes