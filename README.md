# OEC Data Collection

A web application to collect information from child care providers in the State of Connecticut.

## Setup
The OEC data collection application has just a few prerequisites that need to be handled before it's ready for use.

1. Install [Docker](https://hub.docker.com/search?q=&type=edition&offering=community).
1. Install [Docker Compose](https://docs.docker.com/compose/install/), which is included in some OS distributions but must be installed separately in others.
1. Ensure you have the following libraries installed on your machine:
   - [Node 12](https://nodejs.org/en/download/)
   - [Yarn](https://yarnpkg.com/lang/en/docs/install/)
1. Clone (or bind mount) the [`winged-keys` project](https://github.com/ctoec/winged-keys) (our authentication layer) into the **root directory of this project**.
1. Follow the steps outlined in the corresponding README to set up the `winged-keys` project.

You may need to [allocate more memory to Docker](https://stackoverflow.com/a/44533437) (say, ~4 GB). 

If you are developing on an M1/ARM system, you [may](https://github.com/microsoft/mssql-docker/issues/668) need to update the `image` of `db` and `winged-keys-db` in `docker-compose.yaml` to `mcr.microsoft.com/azure-sql-edge`.

## Usage
Once the required libraries are installed, getting the application up and running is a pretty simple task.

1. Install yarn packages, for both client **and** server projects.  This can be accomplished one of two ways:

   - Via Yarn:
   ```sh
   yarn install --frozen-lockfile
   cd client && yarn install --frozen-lockfile
   ```

   - Via Docker:
   ```sh
   docker-compose run -T --rm --entrypoint "yarn install --frozen-lockfile --network-concurrency 1" client
   docker-compose run -T --rm --entrypoint "yarn install --frozen-lockfile" server
   ```

      **NOTE**: The `docker-compose run` command is only necessary on initial set up, since the containers cannot start without installed dependencies. To execute yarn commands once the containers have started, you can use `docker-compose exec`.

1. Start up the application, running it in the background.
   ```sh
   docker-compose up -d
   ```
1. The application should be up and running at https://localhost:5001.  You can also confirm the application is running by checking on the port mappings.

   ```sh
   docker-compose ps
       Name                            Command               State           Ports
   --------------------------------------------------------------------------------------------------
   data-collection_client_1           yarn start                       Up
   data-collection_db_1               /opt/mssql/bin/permissions ...   Up      1401/tcp, 0.0.0.0:5002->1433/tcp
   data-collection_server_1           yarn run watch                   Up      0.0.0.0:5001->3000/tcp
   data-collection_winged-keys-db_1   /opt/mssql/bin/permissions ...   Up      1401/tcp, 0.0.0.0:5051->1433/tcp
   data-collection_winged-keys_1      sh /entrypoint.sh                Up      0.0.0.0:5050->5050/tcp

   ```

Stop the application running in the background with `docker-compose down`.

Reset the database data with `docker-compose rm -s -f db && docker-compose up -d db && docker-compose restart server`.

### Architecture

This mono-repo consists of three main parts:

1. Server, located in the root dir. The backend is an express server, with routes defined in `src/routes`
1. Client, located in `client` dir. The frontend is a React SPA, created with create-react-app.
1. Shared resources, located in `client/src/shared` dir. The shared resources live in the `client/src` directory to play nice with create-react-app. They are included in each project via relative file path imports, and are included in the built resources for both client and server.

### Database

The application has a SQL Server backend. We use [TypeORM](https://typeorm.io/) to manage database migrations. [Read more about our specific use of typeORM here](src/entity/README.md)

## Testing

### Unit Testing

Frontend and backend unit tests exist, and can be run with `yarn test` in either the `src` or `client/src` directories.

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
