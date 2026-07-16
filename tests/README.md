# Amusix automatized testing

This directory contains automatized tests added specifically to ensure that the code put in production is never subject to regression.

These tests are designed to be run by the repo CI / CD pipelines in dedicated test environments.

## Stack

* [Node.js 24](https://nodejs.org/fr)
* [Cypress 15](https://www.cypress.io/) (+ TypeScript)

## File structure

* `cypress/`:
  * `e2e/`: end-to-end tests
    * `frontend/`: frontend tests
    * `backend/`: backend tests
      * User tests
      * Song tests
      * Playlist tests
  * `fixtures/`: test models with fake data
  * `support/`: support resources (Cypress commands, specific configurations, etc.)

Tests are ordered by name (`1-test1.cy.ts`, `2-test2.cy.ts`, ...)

## Startup

These tests are specifically designed to run in specific test environments provided by the repo CI / CD pipelines, however, you can still run them in a local development environment.

> [!CAUTION]
> In case something goes wrong while testing, we advise you to use / configure a blank (but structure applied) database before running the tests.

### Setup

1. Install Node.js (if necessary)

2. Install all project dependencies by running the following command at the project's root in a terminal:

  ```shell
  npm i
  ```

### Run frontend tests

Launch the frontend tests by running the following commands in a terminal at the project's root:

```shell
npm run test -- --spec "cypress/e2e/frontend/**/*" --config "baseUrl=<frontend-base-url>"
```

Replace `<frontend-base-url>` by the base URL of the frontend application to test:

* Local development environment: `http://localhost:4200`
* Containerized application: `http://localhost`

### Run backend tests

Launch the backend tests by running the following commands in a terminal at the project's root:

```shell
npm run test -- --spec "cypress/e2e/backend/**/*" --config "baseUrl=<backend-base-url>"
```

Replace `api-base-url` by the base URL of the backend API to test:

* Local development environment: `http://localhost:5211`
* Containerized application: `http://localhost/api`
