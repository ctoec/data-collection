# OEC Data Collection

A web application to collect information from child care providers in the State of Connecticut.

## Development

### Requirements
1. Bind mount or clone [`winged-keys`](https://github.com/ctoec/winged-keys) into the top-level of this directory.
1. Install git pre-commit hook from `/hooks` dir
    ```sh
       ln -s `pwd`/hooks/pre-commit.sh `pwd`/.git/hooks/pre-commit
    ```
1. Install (if you haven't already) [Docker](https://hub.docker.com/search?q=&type=edition&offering=community). Make sure you have [Docker Compose](https://docs.docker.com/compose/install/), which is included in some OS distributions but must be installed separately in others.

### Running the app
1. Install all corresponding yarn dependencies, based on the static versions specified in `yarn.lock`


    - Via the containers:
    ```sh
    docker-compose run --rm --entry-point "yarn install --frozen-lockfile" client
    docker-compose run --rm --entry-point "yarn install --frozen-lockfile" server
    ```
    **NOTE**: This `docker-compose run` command is only necessary on initial set up, since the containers cannot start without installed dependencies. To execute yarn commands once the containers have started, you can use `docker-compose exec`.


    - Via a local yarn installation
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
    data-collection_client_1           yarn start                       Up      0.0.0.0:5000->3000/tcp       
    data-collection_db_1               docker-entrypoint.sh postgres    Up      5432/tcp   
    data-collection_server_1           yarn run watch                   Up      0.0.0.0:5001->3000/tcp       
    data-collection_winged-keys-db_1   /opt/mssql/bin/permissions ...   Up      1433/tcp                     
    data-collection_winged-keys_1      sh /entrypoint.sh                Up      0.0.0.0:5050->5050/tcp       

    ```

### Architecture
This mono-repo consists of three main parts:
1. Server, located in the root dir. The backend is an express server, with routes defined in `src/routes`
1. Client, located in `client` dir. The frontend is a React SPA, created with create-react-app.
1. Shared resources, located in `/shared` dir. The shared resources are installed in both the backend and frontend via [local path package.json dependencies](https://docs.npmjs.com/files/package.json#local-paths)

## Deploy

Deployments can either be triggered directly through the corresponding AWS CodePipeline for the applicable stage, or directly from the CLI.  Additionally, we also don't utilize Docker in any of our deployment environments, but rather Linux/Node for the sake of simplicity.

### Pipeline
The preferred way of Fawkes deployment would be through AWS CodePipeline, which should automatically be set up for whatever stage you're looking to deploy.  Triggering a new deploy is a simple button click after navigating to the corresponding CodePipeline in the AWS console.

### Command Line
NOTE: This option will require you to have the Elastic Beanstalk CLI installed on your machine.  If you're on OSX, [Homebrew](https://formulae.brew.sh/formula/aws-elasticbeanstalk) is your best bet - otherwise, following the setup scripts outlined in the [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) works just fine.

1. Install the dependencies for the React application.
```bash
cd <path-to-project-root>/client && yarn install --frozen-lockfile
```

1. Once the dependencies are installed, create a prod-ready build of the React app.
```bash
yarn build
```

1. Next, install dependencies for the Express server project.
```bash
cd <path-to-project-root> && yarn install --frozen-lockfile
```

1. Then, transpile the project, generating a Javascript build.
```bash
yarn build
```

1. Generate a bundled .zip artifact of both the React app and Express server, to be used in the proceeding step to deploy directly to Elastic Beanstalk:
```bash
cd <path-to-project-root> && yarn run bundle
```

1. Deploy the artifact you just created to the stage in question:
```bash
eb deploy <elastic-beanstalk-environment> --staged
```
