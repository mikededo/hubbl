<p align="center">
  <img width="200" src="static/Logo.svg" alt="Hubbl logo">
</p>

<h1 align="center">Hubbl Landing</h1>

<div align="center">

**Welcome to the Hubbl monorepo 🗂️**

![GitHub](https://img.shields.io/github/license/hubbl-app/hubbl?color=%237CB9E8&style=for-the-badge)

</div>

# Introduction

The repository contains all the requirements in order to develop the Hubbl app. The entire codebase is written in TypeScript.

## Set-up

The set-up is pretty simple, simply create a similar `.env` as the one in the [`example`](example) folder. After, build the containers by running the following command:

```sh
docker-compose --profile dev up -d
```

You can also build the test containers using the `test` profile instead of the `dev` profile. Nonetheless, the `dev` profile already builds the `test` containers. The `test` profile is mainly used in CI environments.

All relevant information about running any project can be found in the `README.md` of each project.

## Projects

You can find all the projects inside the [`/apps`](./apps) folder:

- [`./apps/api`](apps/api)
- [`./apps/client`](apps/client)
- [`./apps/client-e2e`](apps/client-e2e)
- [`./apps/core`](apps/core)
- [`./apps/core-e2e`](apps/core-e2e)
- [`./apps/landing`](apps/landing)
- [`./apps/landing-e2e`](apps/landing-e2e)

## Libraries

You can find all the libraries inside the [`/libs`](./libs) folder:

- `data-access`
  - [`data-access/api`](libs/data-access/api)
  - [`data-access/contexts`](libs/data-access/contexts)
- `shared`
  - [`shared/models`](libs/shared/models)
  - [`shared/types`](libs/shared/types)
- `ui`
  - [`ui/components`](libs/ui/components)
- [`utils`](libs/utils)

## Tools

You can find all the libraries inside the [`/tools`](./tools) folder:

- [`generators`](tools/generators)
