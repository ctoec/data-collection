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
    docker-compose run --rm --entry-point "yarn install --frozen-lockfile" client
    docker-compose run --rm --entry-point "yarn install --frozen-lockfile" server
    ```
    **NOTE**: This `docker-compose run` command is only necessary on initial set up, since the containers cannot start without installed dependencies. To execute yarn commands once the containers have started, you can use `docker-compose exec`.


    - Via a local yarn installation, yarn requires an updated version of node
    ```sh
    yarn install --frozen-lockfile
    cd client && yarn install --frozen-lockfile # npm install may need to be run in the client directory for this to work
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

### ORM / Migrations
We use [typeorm](https://typeorm.io/) to manage database migration creation and execution.
Migrations are automatically applied by app on startup, defined via variables in `src/ormconfig.ts`.

To generate a migration from schema changes:
```
docker-compose exec server yarn typeorm migration:generate -n [MIGRATION_NAME]
```

NOTE: There is currently [a bug](https://github.com/typeorm/typeorm/issues/4897)
 in the SQL Server driver that causes any column with type "simple-enum"
(a meta-type where a varchar column with CHECK constraint approximates an enum)
to be dropped and recreated in every migration. For now, the easiest workaround
is to just manually delete these changes from your migration. If you're not sure
which changes are from this bug and which are from your migration, create a
should-be no-op migration (with no entity schema changes), and use this as
reference for what is kruft to be deleted.

## Deploy

Deployments can either be triggered directly through the corresponding CircleCI workflow for the branch you're working with, or directly from the CLI.  Additionally, we also don't utilize Docker in any of our deployment environments, but rather Linux/Node for the sake of simplicity.

### CircleCI
The preferred way of Fawkes deployment would be through CircleCI (our CI/CD pipeline solution), which should automatically be set up for whatever stage you're looking to deploy.  Triggering a new deploy is simply a matter of approving the deploy workflow in [the CircleCI UI](https://app.circleci.com/pipelines/github/ctoec/data-collection).

### Command Line
NOTE: This option will require you to have the Elastic Beanstalk CLI installed on your machine.  If you're on OSX, [Homebrew](https://formulae.brew.sh/formula/aws-elasticbeanstalk) is your best bet - otherwise, following the setup scripts outlined in the [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) works just fine.

Once you've done this, deploying is simply a matter of running `deploy.sh` with the stage you'd like to deploy to.

```bash
./deploy.sh <stage>
```
