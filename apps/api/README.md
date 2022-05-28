<p align="center">
  <img width="200" src="../../static/Logo.svg" alt="Hubbl logo">
</p>

<h1 align="center">Hubbl API</h1>

<div align="center">

This application hosts the API of the Hubbl application, from the client's application, to the core, so that everything that happens within your gym is securely stored.

![Coverage Status](https://img.shields.io/codecov/c/github/hubbl-app/hubbl?flag=api&label=api%20coverage&logo=codecov&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/hubbl-app/hubbl?color=%237CB9E8&style=for-the-badge)

</div>

## Project

The application is built using the `@nrlw/express` generator. It is build in TypeScript and uses a controller-service-model approach to handle the requests.

## Development

### Installation

Once the repository has been cloned, install the dependencies of the project.

```sh
# with npm
npm install
```

> If it has already been run, there's no need to run it again

### Execution

The repository already includes the `nx` package, which is the library that manages the monorepo. If the `nx` package is installed globally, to start the server app, in a `dev` environment, run:

```sh
# using the serve alias
nx serve api

# which equals to
nx run api:serve
```

If the package is not installed globally, run:

```sh
# npm start is an alias to nx serve - see package.json
npm start api
```

## Testing

The application has two test types: unit and end-to-end (e2e). The unit tests are required in any class or function that is used. In order to run the tests:

```sh
# unit tests
nx test api
# e2e tests
nx run api:test-e2e
```

### Coverage

The project flag inside CodeCov is `api`.
