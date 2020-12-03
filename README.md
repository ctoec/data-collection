# OEC Data Collection

A web application to collect information from child care providers in the State of Connecticut.

## Development

### Requirements

1. Bind mount or clone [`winged-keys`](https://github.com/ctoec/winged-keys) into the top-level of this directory.
1. Install (if you haven't already) [Docker](https://hub.docker.com/search?q=&type=edition&offering=community). Make sure you have [Docker Compose](https://docs.docker.com/compose/install/), which is included in some OS distributions but must be installed separately in others.

### Running the app

1. Install all corresponding yarn dependencies, based on the static versions specified in `yarn.lock`

   - Via the containers:

   ```sh
   docker-compose run -T --rm --entrypoint "yarn install --frozen-lockfile --network-concurrency 1" client
   docker-compose run -T --rm --entrypoint "yarn install --frozen-lockfile" server
   ```

   **NOTE**: This `docker-compose run` command is only necessary on initial set up, since the containers cannot start without installed dependencies. To execute yarn commands once the containers have started, you can use `docker-compose exec`.

   - Via a local yarn installation, yarn requires an updated version of node

   ```sh
   yarn install --frozen-lockfile
   cd client && yarn install --frozen-lockfile
   ```

1. Start application:
   ```sh
   docker-compose up -d
   ```
1. Ensure application is running and confirm port mappings:

   ```sh
   docker-compose ps
       Name                            Command               State           Ports
   --------------------------------------------------------------------------------------------------
   data-collection_client_1           yarn start                       Up
   data-collection_db_1               /opt/mssql/bin/permissions ...   Up      1433/tcp
   data-collection_server_1           yarn run watch                   Up      0.0.0.0:5001->3000/tcp
   data-collection_winged-keys-db_1   /opt/mssql/bin/permissions ...   Up      1433/tcp
   data-collection_winged-keys_1      sh /entrypoint.sh                Up      0.0.0.0:5050->5050/tcp

   ```

### Architecture

This mono-repo consists of three main parts:

1. Server, located in the root dir. The backend is an express server, with routes defined in `src/routes`
1. Client, located in `client` dir. The frontend is a React SPA, created with create-react-app.
1. Shared resources, located in `client/src/shared` dir. The shared resources live in the `client/src` directory to play nice with create-react-app. They are included in each project via relative file path imports, and are included in the built resources for both client and server.

### Database

The application has a SQL Server backend. We use [typeORM](https://typeorm.io/) to manage database migrations. [Read more about our specific use of typeORM here](src/entity/README.md)

### Testing
#### Unit/Integration testing
Frontend and backend unit/integration tests exist, and can be run with `yarn test` in either the `src` or `client/src` directories.
```
$ cd src
$ yarn test
$ cd ../client/src
$ yarn test
```
or in docker-compose
```
$ docker-compose exec server yarn test
$ docker-compose exec client yarn test
```
Frontend tests include snapshot matching tests. If a change was made that creates a legitimate change to a snapshot, or snapshots need to be deleted, created, or renamed, run tests with `-u` flag

#### Integration/End-to-end testing
We do two types of full-stack testing which encompass the client <-> server interactions and server <-> database interactions.
Because we don't mock or instantiate a SQL Server instance for our unit/integration tests, these tests can only be run against a full stack of the app (either a local docker-compose stack, or a deployed stack)
1. **API Tests**: perhaps a bit confusingly, API integration tests are written in the `client` dir, because we already have a util for calling the api there! find them [here](client/src/integrationTests)

    To run these tests:
    ```
    $ cd client
    $ yarn test-e2e

    ```
    Set `TEST_API_PATH` env var to run them against an environment other than the default `http://localhost:5001`

2. **End-to-end Tests**: these [nightwatch](https://nightwatchjs.org/)-powered selemnium tests run in Browserstack. Thus, they can only be run against a deployed stack (for now, there are ways to set up Browserstack for local apps but we haven't done that). They live [here](e2e-tests), and there's more info about them [here](e2e-tests/README.md)

    To run the e2e tests:
    **NOTE**: Be sure to add browserstack credentials to a .env file or export them as env vars
    ```
    $ cd e2e-tests
    $ yarn test
    ```
    Set `LAUNCH_URL` env var to run them against an environment other than the default `https://staging.ece-fawkes.ctoecskylight.com`

## Deploy

Deployments can either be triggered directly through the corresponding CircleCI workflow for the branch you're working with, or directly from the CLI. Additionally, we also don't utilize Docker in any of our deployment environments, but rather Linux/Node for the sake of simplicity.

### CircleCI

The preferred way of Fawkes deployment would be through CircleCI (our CI/CD pipeline solution), which should automatically be set up for whatever stage you're looking to deploy. Triggering a new deploy is simply a matter of approving the deploy workflow in [the CircleCI UI](https://app.circleci.com/pipelines/github/ctoec/data-collection).

### Command Line

NOTE: This option will require you to have the Elastic Beanstalk CLI installed on your machine. If you're on OSX, [Homebrew](https://formulae.brew.sh/formula/aws-elasticbeanstalk) is your best bet - otherwise, following the setup scripts outlined in the [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) works just fine.

Once you've done this, deploying is simply a matter of running `deploy.sh` with the stage you'd like to deploy to.

```bash
./deploy.sh <stage>
```
