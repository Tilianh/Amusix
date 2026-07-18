# Amusix automatized testing

This directory contains automatized tests added specifically to ensure that the code put in production is never subject to regression.

These tests are designed to be run by the repo CI / CD pipelines in dedicated test environments.

## Stack

<a href="https://nodejs.org"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white"/></a>
<a href="https://www.cypress.io"><img alt="Cypress" src="https://img.shields.io/badge/Cypress-69D3A7.svg?style=for-the-badge&logo=Cypress&logoColor=white"/></a>
<a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white"/></a>

> [!NOTE]
> Check the `package.json` file at the project's root to get an overview of all dependencies and versions.

## Project structure

```
cypress
├───e2e
│   ├───backend
│   └───frontend
├───fixtures
└───support
```

* `e2e/backend/`: frontend end-to-end tests
* `e2e/frontend/`: backend end-to-end tests
* `fixtures/`: test models with fake data
* `support/`: support resources (Cypress commands, scripts, configurations, etc.)

> [!NOTE]
> Tests in `e2e/backend` and `e2e/frontend` are ordered by name (`1-test1.cy.ts`, `2-test2.cy.ts`, ...).

## Startup (for development)

These tests are specifically designed to run in specific test environments provided by the repo CI / CD pipelines, however, you can still run them in a local development environment.

> [!CAUTION]
> In case something goes wrong while testing, we advise you to use / configure a blank database before running the tests.

### Setup

1. Install [Node.js](https://nodejs.org) (if necessary)

2. Install all project dependencies by running the following command at the project's root in a terminal:
    ```shell
    npm i
    ```

### Run

> [!CAUTION]
> You cannot run the frontend and backend tests at once since they require distinct environments. 

#### Run frontend tests

Launch the frontend tests by running the following commands in a terminal at the project's root:

```shell
npm run test -- --spec "cypress/e2e/frontend/**/*" --config "baseUrl=<frontend-base-url>"
```

Replace `<frontend-base-url>` by the base URL of the frontend application to test:

* Local development environment: `http://localhost:4200`
* Containerized application: `http://localhost:2026`

#### Run backend tests

Launch the backend tests by running the following commands in a terminal at the project's root:

```shell
npm run test -- --spec "cypress/e2e/backend/**/*" --config "baseUrl=<backend-base-url>"
```

Replace `api-base-url` by the base URL of the backend API to test:

* Local development environment: `http://localhost:5211`
* Containerized application: `http://localhost/api`
