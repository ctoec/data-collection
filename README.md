# OEC Data Collection

A web application to collect information from child care providers in the State of Connecticut.

## Development

### Requirements
1. Bind mount or clone [`winged-keys`](https://github.com/ctoec/winged-keys) into the top-level of this directory.

#### Local
1. Install (if you haven't already) Visual Studio, [Node 12](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/lang/en/docs/install/).

2. Install all corresponding yarn dependencies, based on the static versions specified in `yarn.lock`:
    ```.sh
    yarn install --frozen-lockfile
    ```

3. Follow steps 2 and 3 again from within the `client` directory, located in project root.

#### Docker
1. Install (if you haven't already) [Docker](https://hub.docker.com/search?q=&type=edition&offering=community). Make sure you have [Docker Compose](https://docs.docker.com/compose/install/), which is included in some OS distributions but must be installed separately in others.
2. Install all corresponding yarn dependencies, based on the static versions specified in `yarn.lock`, via the containers:
    ```sh
    docker-compose --entrypoint "yarn install --frozen-lockfile" client
    docker-compose --entrypoint "yarn install --frozen-lockfile" server
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
    data-collection_server_1           yarn run watch                   Up      0.0.0.0:5001->3000/tcp       
    data-collection_winged-keys-db_1   /opt/mssql/bin/permissions ...   Up      1433/tcp                     
    data-collection_winged-keys_1      sh /entrypoint.sh                Up      0.0.0.0:5050->5050/tcp       

    ```
