# OEC Data Collection

A web application to collect information from child care providers in the State of Connecticut.

## Development

### Requirements
1. Bind mount or clone [`winged-keys`](https://github.com/ctoec/winged-keys) into the top-level of this directory.

2. Install (if you haven't already) Visual Studio, [Node 12](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/lang/en/docs/install/).

3. Install all corresponding yarn dependencies, based on the static versions specified in `yarn.lock`:
    ```.sh
    yarn install --frozen-lockfile
    ```

4. Follow steps 2 and 3 again from within the `client` directory, located in project root.