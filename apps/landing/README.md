<p align="center">
  <img width="200" src="../../static/Logo.svg" alt="Hubbl logo">
</p>

<h1 align="center">Hubbl Landing</h1>

<div align="center">

This folder hosts the source code of the Hubbl Landing application.

![Coverage Status](https://img.shields.io/codecov/c/github/hubbl-app/hubbl?flag=api&label=landing%20coverage&logo=codecov&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/hubbl-app/hubbl?color=%237CB9E8&style=for-the-badge)

</div>

## Project

The application is built using the `@nrlw/next` generator. It is build in TypeScript and NextJS.

## Development

### Installation

Once the repository has been cloned, install the dependencies of the project.

```sh
# with npm
npm install
```

> If it has already been run, there's no need to run it again

### `/etc/hosts`

The application it is run in a non-existing (fake) URL, meaning that the DNS will not be able to find the `landing.hubbl.local` server. In order to run the app locally, add the following line in your `/etc/hosts/` file:

```sh
127.0.0.1   landing.hubbl.local
```

### Execution

The repository already includes the `nx` package, which is the library that manages the monorepo. If the `nx` package is installed globally, to start the landing app, in a `dev` environment, run:

```sh
# using the serve alias
nx serve landing

# which equals to
nx run landing:serve
```

If the `nx` package is not installed globally, run:

```sh
# npm start is an alias to nx serve - see package.json
npm start api
```

## Testing

The application has two test types: unit and end-to-end (e2e). The unit tests are required in any class or function that is used. In order to run the tests:

```sh
# unit tests
nx test landing

# e2e tests
nx test landing-e2e
```

> You can find the e2e tests in the `/apps/landing-e2e` project.

### Coverage

The project flag inside CodeCov is `landing`.