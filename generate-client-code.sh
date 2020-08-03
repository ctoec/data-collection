#!/bin/bash
rm -rf client/src/generated
docker run --rm -u "$(id -u)" -v "$(pwd)":/local openapitools/openapi-generator-cli:v4.2.2 generate -i /local/swagger.json -g typescript-fetch -o /local/client/src/generated --additional-properties="typescriptThreePlus=true"
