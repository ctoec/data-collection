# OEC Data Collection

A web application to collect information from child care providers in the State of Connecticut.

## Development

### Requirements
1. Bind mount or clone [`winged-keys`](https://github.com/ctoec/winged-keys) into the top-level of this directory.
2. Install git pre-commit hook from `/hooks` dir
    ```sh
       ln -s `pwd`/hooks/pre-commit.sh `pwd`/.git/hooks/pre-commit
    ```

### OpenAPI Spec and Client Code Generation
This application uses a code-first automated generation strategy for producing the Express API, an OpenAPI Spec, and client-calling code to the API.

To generate the generated routes, run:
```bash
yarn run tsoa routes
```

To generate the OpenAPI specification, run:
```bash
yarn run tsoa spec
```

To generate the client code, run the included Bash file: `./generate-client-code.sh`.

### Running the app
1. Install (if you haven't already) [Docker](https://hub.docker.com/search?q=&type=edition&offering=community). Make sure you have [Docker Compose](https://docs.docker.com/compose/install/), which is included in some OS distributions but must be installed separately in others.
2. Install all corresponding yarn dependencies, based on the static versions specified in `yarn.lock`, via the containers:
    ```sh
    docker-compose exec client yarn install --frozen-lockfile
    docker-compose exec server yarn install --frozen-lockfile
    ```
3. Start application:
    ```sh
    docker-compose up -d
    ```
4. Ensure application is running and confirm port mappings:
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

## Deploy

Deployments can either be triggered directly through the corresponding Azure pipeline for the applicable stage, or directly from the CLI.

### Command Line
NOTE: This option will require you to have the Elastic Beanstalk CLI installed on your machine.  If you're on OSX, [Homebrew](https://formulae.brew.sh/formula/aws-elasticbeanstalk) is your best bet - otherwise, following the setup scripts outlined in the [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) works just fine.

1. Install the dependencies for the React application.
```bash
cd <path-to-project-root>/client && yarn install
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